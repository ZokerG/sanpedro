package com.festival.application.service.solicitud;

import com.festival.application.dto.solicitud.SolicitudParticipacionDTO;
import com.festival.application.dto.solicitud.SolicitudParticipacionRequestDTO;
import com.festival.application.mapper.SolicitudParticipacionMapper;
import com.festival.application.usecase.solicitud.SolicitudParticipacionUseCase;
import com.festival.entity.*;
import com.festival.infrastructure.persistence.repository.*;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudParticipacionServiceImpl implements SolicitudParticipacionUseCase {

    private final SolicitudParticipacionRepository solicitudRepository;
    private final PersonalRepository personalRepository;
    private final EventoRepository eventoRepository;
    private final AsignacionPersonalRepository asignacionRepository;
    private final SolicitudParticipacionMapper mapper;

    @Override
    @Transactional
    public SolicitudParticipacionDTO crearSolicitud(Long personalId, SolicitudParticipacionRequestDTO requestDTO) {
        Personal personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + personalId));

        // Solo personal logístico puede solicitar participar en eventos
        if (personal.getTipoPersonal() != TipoPersonal.LOGISTICO) {
            throw new IllegalArgumentException("Solo el personal logístico puede solicitar participación en eventos.");
        }

        Evento evento = eventoRepository.findById(requestDTO.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + requestDTO.getEventoId()));

        // Verificar que no exista una solicitud activa (pendiente) para el mismo personal+evento
        boolean existeActiva = solicitudRepository
                .findByPersonalIdAndEventoIdAndEstadoIn(personalId, requestDTO.getEventoId(),
                        List.of(EstadoSolicitud.PENDIENTE))
                .isPresent();
        if (existeActiva) {
            throw new IllegalArgumentException("Ya tienes una solicitud pendiente para este evento.");
        }

        SolicitudParticipacion solicitud = new SolicitudParticipacion();
        solicitud.setPersonal(personal);
        solicitud.setEvento(evento);
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setRolAsignado(requestDTO.getRolAsignado());

        return mapper.toDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudParticipacionDTO> obtenerMisSolicitudes(Long personalId) {
        return solicitudRepository.findByPersonalIdOrderByFechaSolicitudDesc(personalId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudParticipacionDTO> obtenerPorEvento(Long eventoId) {
        return solicitudRepository.findByEventoIdOrderByFechaSolicitudDesc(eventoId).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudParticipacionDTO> obtenerPendientesPorEvento(Long eventoId) {
        return solicitudRepository.findByEventoIdAndEstado(eventoId, EstadoSolicitud.PENDIENTE).stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SolicitudParticipacionDTO aprobarSolicitud(Long solicitudId) {
        SolicitudParticipacion solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("La solicitud ya fue resuelta (estado: " + solicitud.getEstado() + ")");
        }

        Personal personal = solicitud.getPersonal();
        Evento evento = solicitud.getEvento();

        // Validar que el personal tenga documentos completos antes de asignar
        // (Reusamos la lógica del PersonalService verificando los 5 documentos mínimos)
        List<TipoDocumentoRequerido> docsMinimos = List.of(
                TipoDocumentoRequerido.CEDULA,
                TipoDocumentoRequerido.RUT,
                TipoDocumentoRequerido.CERTIFICADO_BANCARIO,
                TipoDocumentoRequerido.CONTRATO_FIRMADO,
                TipoDocumentoRequerido.FOTO_PERFIL
        );
        boolean docsCompletos = docsMinimos.stream().allMatch(tipo ->
                documentoPersonalRepository
                        .findByPersonalIdAndTipoDocumentoRequerido(personal.getId(), tipo)
                        .map(doc -> doc.getEstado() == EstadoDocumento.VERIFICADO)
                        .orElse(false)
        );
        if (!docsCompletos) {
            throw new IllegalArgumentException(
                    "No se puede aprobar: el personal tiene documentos pendientes de verificación. " +
                    "Debe completar y verificar todos los documentos mínimos antes de ser asignado."
            );
        }

        // Validar límite de personal del evento
        if (evento.getLimitePersonal() != null) {
            long asignados = asignacionRepository.countActivasByEventoId(evento.getId());
            if (asignados >= evento.getLimitePersonal()) {
                throw new IllegalArgumentException(
                        "El evento ha alcanzado el límite de " + evento.getLimitePersonal() + " personas."
                );
            }
        }

        // Crear la AsignacionPersonal
        AsignacionPersonal asignacion = new AsignacionPersonal();
        asignacion.setPersonal(personal);
        asignacion.setEvento(evento);
        asignacion.setRolAsignado(solicitud.getRolAsignado());
        asignacion.setFechaAsignacion(LocalDateTime.now());
        asignacion.setActivo(true);
        asignacion.setAsistio(false);

        asignacion = asignacionRepository.save(asignacion);

        // Actualizar solicitud
        solicitud.setEstado(EstadoSolicitud.APROBADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        solicitud.setAsignacion(asignacion);

        return mapper.toDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @Transactional
    public SolicitudParticipacionDTO rechazarSolicitud(Long solicitudId, String notaRechazo) {
        SolicitudParticipacion solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("La solicitud ya fue resuelta (estado: " + solicitud.getEstado() + ")");
        }

        solicitud.setEstado(EstadoSolicitud.RECHAZADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        solicitud.setNotaRechazo(notaRechazo);

        return mapper.toDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @Transactional
    public void cancelarSolicitud(Long solicitudId) {
        SolicitudParticipacion solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new IllegalStateException("Solo se pueden cancelar solicitudes pendientes.");
        }

        solicitud.setEstado(EstadoSolicitud.CANCELADA);
        solicitud.setFechaResolucion(LocalDateTime.now());
        solicitudRepository.save(solicitud);
    }

    @Override
    @Transactional(readOnly = true)
    public SolicitudParticipacionDTO obtenerSolicitud(Long id) {
        return solicitudRepository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + id));
    }

    // ─── Dependencies ────────────────────────────────────────────────────────

    private final DocumentoPersonalRepository documentoPersonalRepository;
}
