package com.festival.application.service.asistencia;

import com.festival.application.dto.asistencia.EscanearQrRequestDTO;
import com.festival.application.dto.asistencia.EscanearQrResponseDTO;
import com.festival.application.dto.asistencia.EscanearQrResponseDTO.ResultadoEscaneo;
import com.festival.application.dto.asistencia.RegistroAsistenciaDTO;
import com.festival.application.usecase.asistencia.AsistenciaUseCase;
import com.festival.entity.AsignacionPersonal;
import com.festival.entity.RegistroAsistencia;
import com.festival.entity.TipoRegistroAsistencia;
import com.festival.infrastructure.persistence.repository.AsignacionPersonalRepository;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.persistence.repository.RegistroAsistenciaRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaUseCase {

    private final AsignacionPersonalRepository asignacionRepository;
    private final PersonalRepository personalRepository;
    private final RegistroAsistenciaRepository registroRepository;

    @Override
    @Transactional
    public EscanearQrResponseDTO escanear(EscanearQrRequestDTO dto) {
        EscanearQrResponseDTO response = new EscanearQrResponseDTO();

        // 1. Buscar el Personal por codigoQr
        var personalOpt = personalRepository.findByCodigoQr(dto.getCodigoQr());
        if (personalOpt.isEmpty()) {
            response.setResultado(ResultadoEscaneo.RECHAZADO);
            response.setMensaje("QR no reconocido. No existe personal con este código.");
            return response;
        }
        var personal = personalOpt.get();

        // 2. Buscar asignación activa para este personal + evento
        Optional<AsignacionPersonal> asignacionOpt = asignacionRepository
                .findByPersonalIdAndEventoIdAndActivoTrue(personal.getId(), dto.getEventoId());

        if (asignacionOpt.isEmpty()) {
            response.setResultado(ResultadoEscaneo.RECHAZADO);
            response.setNombrePersonal(personal.getNombreCompleto());
            response.setDocumento(personal.getNumeroDocumento());
            response.setMensaje("El logístico " + personal.getNombreCompleto()
                    + " no tiene asignación activa en este evento.");
            return response;
        }

        AsignacionPersonal asignacion = asignacionOpt.get();

        // 3. Determinar si es INGRESO o SALIDA
        boolean yaIngreso = registroRepository.existsByAsignacionIdAndTipo(
                asignacion.getId(), TipoRegistroAsistencia.INGRESO);

        TipoRegistroAsistencia tipo = yaIngreso
                ? TipoRegistroAsistencia.SALIDA
                : TipoRegistroAsistencia.INGRESO;

        // 4. Si es INGRESO: marcar asistio = true en la asignación
        if (tipo == TipoRegistroAsistencia.INGRESO) {
            asignacion.setAsistio(true);
            asignacionRepository.save(asignacion);
            log.info("Asistencia confirmada para personal {} en evento {}",
                    personal.getId(), dto.getEventoId());
        }

        // 5. Crear el registro de asistencia
        RegistroAsistencia registro = new RegistroAsistencia();
        registro.setAsignacion(asignacion);
        registro.setTipo(tipo);
        registro.setTimestampRegistro(LocalDateTime.now());
        registro.setRegistradoPor(dto.getRegistradoPor());
        registro = registroRepository.save(registro);

        // 6. Construir respuesta
        response.setResultado(tipo == TipoRegistroAsistencia.INGRESO
                ? ResultadoEscaneo.INGRESO : ResultadoEscaneo.SALIDA);
        response.setNombrePersonal(personal.getNombreCompleto());
        response.setDocumento(personal.getNumeroDocumento());
        response.setNumeroCamiseta(personal.getNumeroCamiseta());
        response.setRolAsignado(asignacion.getRolAsignado());
        response.setRegistroId(registro.getId());
        response.setMensaje(tipo == TipoRegistroAsistencia.INGRESO
                ? "Ingreso registrado correctamente."
                : "Salida registrada correctamente.");

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistenciaDTO> obtenerPorEvento(Long eventoId) {
        return registroRepository.findByEventoIdOrderByTimestampDesc(eventoId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private RegistroAsistenciaDTO mapToDTO(RegistroAsistencia r) {
        RegistroAsistenciaDTO dto = new RegistroAsistenciaDTO();
        dto.setId(r.getId());
        dto.setAsignacionId(r.getAsignacion().getId());
        dto.setPersonalId(r.getAsignacion().getPersonal().getId());
        dto.setNombrePersonal(r.getAsignacion().getPersonal().getNombreCompleto());
        dto.setDocumento(r.getAsignacion().getPersonal().getNumeroDocumento());
        dto.setNumeroCamiseta(r.getAsignacion().getPersonal().getNumeroCamiseta());
        dto.setTipo(r.getTipo().name());
        dto.setTimestampRegistro(r.getTimestampRegistro());
        dto.setRegistradoPor(r.getRegistradoPor());
        return dto;
    }
}
