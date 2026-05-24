package com.festival.application.service.jornada;

import com.festival.application.dto.jornada.*;
import com.festival.application.usecase.jornada.JornadaUseCase;
import com.festival.entity.*;
import com.festival.infrastructure.persistence.repository.*;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JornadaServiceImpl implements JornadaUseCase {

    private final JornadaPersonalRepository jornadaRepository;
    private final UbicacionPersonalRepository ubicacionRepository;
    private final PersonalRepository personalRepository;
    private final EventoRepository eventoRepository;

    @Override
    @Transactional
    public JornadaResponseDTO iniciarJornada(Long personalId, IniciarJornadaRequestDTO dto) {
        Personal personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + personalId));

        jornadaRepository.findActivaByPersonalId(personalId).ifPresent(j -> {
            throw new IllegalStateException("El personal ya tiene una jornada activa. Finalícela antes de iniciar una nueva.");
        });

        JornadaPersonal jornada = new JornadaPersonal();
        jornada.setPersonal(personal);
        jornada.setEstado(EstadoJornada.ACTIVO);
        jornada.setFechaInicio(LocalDateTime.now());

        if (dto.getEventoId() != null) {
            Evento evento = eventoRepository.findById(dto.getEventoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));
            jornada.setEvento(evento);
        }

        jornada = jornadaRepository.save(jornada);
        log.info("Jornada iniciada para personal {} (ID: {})", personal.getNombreCompleto(), personalId);

        return mapToResponseDTO(jornada);
    }

    @Override
    @Transactional
    public JornadaResponseDTO cambiarEstado(Long jornadaId, CambiarEstadoRequestDTO dto) {
        JornadaPersonal jornada = jornadaRepository.findById(jornadaId)
                .orElseThrow(() -> new ResourceNotFoundException("Jornada no encontrada con ID: " + jornadaId));

        if (jornada.getEstado() == EstadoJornada.FIN_JORNADA) {
            throw new IllegalStateException("La jornada ya fue finalizada.");
        }

        jornada.setEstado(dto.getNuevoEstado());

        if (dto.getNuevoEstado() == EstadoJornada.FIN_JORNADA) {
            jornada.setFechaFin(LocalDateTime.now());
            log.info("Jornada {} finalizada para personal {}", jornadaId, jornada.getPersonal().getNombreCompleto());
        } else {
            log.info("Jornada {} cambió a estado {}", jornadaId, dto.getNuevoEstado());
        }

        jornada = jornadaRepository.save(jornada);
        return mapToResponseDTO(jornada);
    }

    @Override
    @Transactional
    public UbicacionResponseDTO reportarUbicacion(Long jornadaId, UbicacionRequestDTO dto) {
        JornadaPersonal jornada = jornadaRepository.findById(jornadaId)
                .orElseThrow(() -> new ResourceNotFoundException("Jornada no encontrada con ID: " + jornadaId));

        if (jornada.getEstado() == EstadoJornada.FIN_JORNADA) {
            throw new IllegalStateException("No se puede reportar ubicación en una jornada finalizada.");
        }

        UbicacionPersonal ubicacion = new UbicacionPersonal();
        ubicacion.setJornada(jornada);
        ubicacion.setPersonal(jornada.getPersonal());
        ubicacion.setLatitud(dto.getLatitud());
        ubicacion.setLongitud(dto.getLongitud());
        ubicacion.setPrecisionGps(dto.getPrecisionGps());
        ubicacion.setTimestamp(LocalDateTime.now());

        ubicacion = ubicacionRepository.save(ubicacion);

        return UbicacionResponseDTO.builder()
                .id(ubicacion.getId())
                .jornadaId(jornadaId)
                .personalId(jornada.getPersonal().getId())
                .latitud(ubicacion.getLatitud())
                .longitud(ubicacion.getLongitud())
                .precisionGps(ubicacion.getPrecisionGps())
                .timestamp(ubicacion.getTimestamp())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JornadaResponseDTO obtenerJornadaActiva(Long personalId) {
        JornadaPersonal jornada = jornadaRepository.findActivaByPersonalId(personalId)
                .orElseThrow(() -> new ResourceNotFoundException("No hay jornada activa para el personal ID: " + personalId));
        return mapToResponseDTO(jornada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JornadaResponseDTO> obtenerJornadasActivas() {
        List<JornadaPersonal> activas = jornadaRepository.findActivasWithPersonal();
        List<Long> jornadaIds = activas.stream().map(JornadaPersonal::getId).toList();

        Map<Long, UbicacionPersonal> ultimasUbicaciones = ubicacionRepository
                .findLatestByJornadaIds(jornadaIds).stream()
                .collect(Collectors.toMap(
                        u -> u.getJornada().getId(),
                        u -> u,
                        (a, b) -> a.getTimestamp().isAfter(b.getTimestamp()) ? a : b));

        return activas.stream()
                .map(j -> mapToResponseDTO(j, ultimasUbicaciones.get(j.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardOperativoDTO obtenerDashboardOperativo() {
        List<JornadaPersonal> activas = jornadaRepository.findActivasWithPersonal();
        List<Long> jornadaIds = activas.stream().map(JornadaPersonal::getId).toList();

        Map<Long, UbicacionPersonal> ultimasUbicaciones = ubicacionRepository
                .findLatestByJornadaIds(jornadaIds).stream()
                .collect(Collectors.toMap(
                        u -> u.getJornada().getId(),
                        u -> u,
                        (a, b) -> a.getTimestamp().isAfter(b.getTimestamp()) ? a : b));

        int totalActivos = 0;
        int totalEnRuta = 0;
        int totalEnPausa = 0;

        for (JornadaPersonal j : activas) {
            switch (j.getEstado()) {
                case ACTIVO -> totalActivos++;
                case EN_RUTA -> totalEnRuta++;
                case PAUSA -> totalEnPausa++;
            }
        }

        List<JornadaResponseDTO> personalEnCampo = activas.stream()
                .map(j -> mapToResponseDTO(j, ultimasUbicaciones.get(j.getId())))
                .toList();

        return DashboardOperativoDTO.builder()
                .totalActivos(totalActivos)
                .totalEnRuta(totalEnRuta)
                .totalEnPausa(totalEnPausa)
                .totalJornadasActivas(activas.size())
                .personalEnCampo(personalEnCampo)
                .build();
    }

    private JornadaResponseDTO mapToResponseDTO(JornadaPersonal j) {
        return mapToResponseDTO(j, null);
    }

    private JornadaResponseDTO mapToResponseDTO(JornadaPersonal j, UbicacionPersonal ultimaUbicacion) {
        Personal p = j.getPersonal();

        JornadaResponseDTO dto = JornadaResponseDTO.builder()
                .id(j.getId())
                .personalId(p.getId())
                .nombrePersonal(p.getNombreCompleto())
                .documento(p.getNumeroDocumento())
                .numeroCamiseta(p.getNumeroCamiseta())
                .fotoPerfil(p.getFotoPerfil())
                .estado(j.getEstado())
                .fechaInicio(j.getFechaInicio())
                .fechaFin(j.getFechaFin())
                .build();

        if (j.getEvento() != null) {
            dto.setEventoId(j.getEvento().getId());
            dto.setNombreEvento(j.getEvento().getNombre());
        }

        if (ultimaUbicacion != null) {
            dto.setUltimaUbicacion(UbicacionResponseDTO.builder()
                    .id(ultimaUbicacion.getId())
                    .jornadaId(ultimaUbicacion.getJornada().getId())
                    .personalId(ultimaUbicacion.getPersonal().getId())
                    .latitud(ultimaUbicacion.getLatitud())
                    .longitud(ultimaUbicacion.getLongitud())
                    .precisionGps(ultimaUbicacion.getPrecisionGps())
                    .timestamp(ultimaUbicacion.getTimestamp())
                    .build());
        }

        return dto;
    }
}
