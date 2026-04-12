package com.festival.application.service.asignacion;

import com.festival.application.dto.asignacion.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacion.AsignacionPersonalResponseDTO;
import com.festival.application.dto.asignacion.LiquidacionEventoDTO;
import com.festival.application.usecase.asignacion.AsignacionPersonalUseCase;
import com.festival.entity.*;
import com.festival.infrastructure.persistence.repository.AsignacionPersonalRepository;
import com.festival.infrastructure.persistence.repository.DocumentoPersonalRepository;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsignacionPersonalServiceImpl implements AsignacionPersonalUseCase {

    private final AsignacionPersonalRepository asignacionRepository;
    private final PersonalRepository personalRepository;
    private final EventoRepository eventoRepository;
    private final DocumentoPersonalRepository documentoPersonalRepository;

    /** Documentos mínimos requeridos para que un personal pueda trabajar. */
    private static final List<TipoDocumentoRequerido> DOCUMENTOS_MINIMOS = List.of(
            TipoDocumentoRequerido.CEDULA,
            TipoDocumentoRequerido.RUT,
            TipoDocumentoRequerido.CERTIFICADO_BANCARIO,
            TipoDocumentoRequerido.CONTRATO_FIRMADO,
            TipoDocumentoRequerido.FOTO_PERFIL
    );

    @Override
    @Transactional
    public AsignacionPersonalResponseDTO crearAsignacion(AsignacionPersonalRequestDTO dto) {
        Personal personal = personalRepository.findById(dto.getPersonalId())
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + dto.getPersonalId()));

        // Validación de negocio: solo logístico puede asignarse a eventos
        if (personal.getTipoPersonal() != TipoPersonal.LOGISTICO) {
            throw new IllegalArgumentException(
                    "Solo el personal logístico puede ser asignado a eventos. Tipo actual: " + personal.getTipoPersonal()
            );
        }

        // Regla de negocio: todos los documentos mínimos deben estar VERIFICADOS
        if (!todosDocumentosMinimosVerificados(personal.getId())) {
            throw new IllegalArgumentException(
                    "El personal no puede ser asignado a eventos porque tiene documentos pendientes de verificación. " +
                    "Complete los documentos mínimos (Cédula, RUT, Certificado Bancario, Contrato Firmado, Foto de Perfil) " +
                    "y verifíquelos antes de asignar."
            );
        }

        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));

        // Validación de límite de personal
        if (evento.getLimitePersonal() != null) {
            long asignadosActuales = asignacionRepository.countActivasByEventoId(dto.getEventoId());
            if (asignadosActuales >= evento.getLimitePersonal()) {
                throw new IllegalArgumentException(
                        "El evento ha alcanzado el límite máximo de " + evento.getLimitePersonal() + " personas."
                );
            }
        }

        // Evitar asignación duplicada
        if (asignacionRepository.existsByPersonalIdAndEventoIdAndActivoTrue(dto.getPersonalId(), dto.getEventoId())) {
            throw new IllegalArgumentException("Esta persona ya está activamente asignada a este evento.");
        }

        AsignacionPersonal asignacion = new AsignacionPersonal();
        asignacion.setPersonal(personal);
        asignacion.setEvento(evento);
        asignacion.setRolAsignado(dto.getRolAsignado());
        asignacion.setFechaAsignacion(LocalDateTime.now());

        return mapToDTO(asignacionRepository.save(asignacion));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPersonalResponseDTO> obtenerPorEvento(Long eventoId) {
        return asignacionRepository.findByEventoId(eventoId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPersonalResponseDTO> obtenerPorPersonal(Long personalId) {
        return asignacionRepository.findByPersonalId(personalId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void confirmarAsistencia(Long asignacionId) {
        AsignacionPersonal asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con ID: " + asignacionId));
        asignacion.setAsistio(true);
        asignacionRepository.save(asignacion);
    }

    @Override
    @Transactional
    public void desactivarAsignacion(Long id) {
        AsignacionPersonal asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con ID: " + id));
        asignacion.setActivo(false);
        asignacionRepository.save(asignacion);
    }

    @Override
    @Transactional
    public void eliminarAsignacion(Long id) {
        if (!asignacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asignación no encontrada con ID: " + id);
        }
        asignacionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public LiquidacionEventoDTO liquidarEvento(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + eventoId));

        long totalAsignados = asignacionRepository.countActivasByEventoId(eventoId);
        long totalAsistentes = asignacionRepository.countAsistentesConfirmadosByEventoId(eventoId);

        BigDecimal cuota = evento.getCuotaPago() != null ? evento.getCuotaPago() : BigDecimal.ZERO;
        BigDecimal costoReal = cuota.multiply(BigDecimal.valueOf(totalAsistentes));
        BigDecimal presupuesto = evento.getPresupuestoAprobado() != null ? evento.getPresupuestoAprobado() : BigDecimal.ZERO;
        BigDecimal diferencia = presupuesto.subtract(costoReal);

        LiquidacionEventoDTO liquidacion = new LiquidacionEventoDTO();
        liquidacion.setEventoId(eventoId);
        liquidacion.setNombreEvento(evento.getNombre());
        liquidacion.setTotalAsignados((int) totalAsignados);
        liquidacion.setTotalAsistentes((int) totalAsistentes);
        liquidacion.setCuotaPago(cuota);
        liquidacion.setCostoReal(costoReal);
        liquidacion.setPresupuestoAprobado(presupuesto);
        liquidacion.setDiferencia(diferencia);
        liquidacion.setEstado(diferencia.compareTo(BigDecimal.ZERO) >= 0 ? "DENTRO_PRESUPUESTO" : "DEFICIT");

        return liquidacion;
    }

    private AsignacionPersonalResponseDTO mapToDTO(AsignacionPersonal a) {
        AsignacionPersonalResponseDTO dto = new AsignacionPersonalResponseDTO();
        dto.setId(a.getId());
        dto.setPersonalId(a.getPersonal().getId());
        dto.setNombrePersonal(a.getPersonal().getPrimerNombre());
        dto.setApellidoPersonal(a.getPersonal().getPrimerApellido());
        dto.setDocumentoPersonal(a.getPersonal().getNumeroDocumento());
        dto.setNumeroCamiseta(a.getPersonal().getNumeroCamiseta());
        dto.setEventoId(a.getEvento().getId());
        dto.setNombreEvento(a.getEvento().getNombre());
        dto.setRolAsignado(a.getRolAsignado());
        dto.setFechaAsignacion(a.getFechaAsignacion());
        dto.setAsistio(a.isAsistio());
        dto.setActivo(a.isActivo());
        return dto;
    }

    /**
     * Verifica que los 5 documentos mínimos estén cargados y en estado VERIFICADO.
     */
    private boolean todosDocumentosMinimosVerificados(Long personalId) {
        return DOCUMENTOS_MINIMOS.stream().allMatch(tipo ->
                documentoPersonalRepository
                        .findByPersonalIdAndTipoDocumentoRequerido(personalId, tipo)
                        .map(doc -> doc.getEstado() == EstadoDocumento.VERIFICADO)
                        .orElse(false)
        );
    }
}
