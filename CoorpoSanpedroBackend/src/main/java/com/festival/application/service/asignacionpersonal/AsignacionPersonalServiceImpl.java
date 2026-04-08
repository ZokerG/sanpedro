package com.festival.application.service.asignacionpersonal;

import com.festival.application.dto.asignacionpersonal.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacionpersonal.AsignacionPersonalResponseDTO;
import com.festival.application.usecase.asignacionpersonal.AsignacionPersonalUseCase;
import com.festival.entity.AsignacionPersonalLogistico;
import com.festival.entity.Evento;
import com.festival.entity.PersonalLogistico;
import com.festival.infrastructure.persistence.repository.AsignacionPersonalLogisticoRepository;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.PersonalLogisticoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsignacionPersonalServiceImpl implements AsignacionPersonalUseCase {

    private final AsignacionPersonalLogisticoRepository asignacionRepository;
    private final EventoRepository eventoRepository;
    private final PersonalLogisticoRepository personalRepository;

    @Override
    @Transactional
    public AsignacionPersonalResponseDTO crearAsignacion(AsignacionPersonalRequestDTO requestDTO) {
        if (asignacionRepository.existsByPersonalIdAndEventoIdAndActivoTrue(
                requestDTO.getPersonalId(), requestDTO.getEventoId())) {
            throw new IllegalStateException("El personal ya está asignado a este evento");
        }

        AsignacionPersonalLogistico asignacion = new AsignacionPersonalLogistico();
        mapToEntity(requestDTO, asignacion);
        return mapToDTO(asignacionRepository.save(asignacion));
    }

    @Override
    @Transactional
    public AsignacionPersonalResponseDTO actualizarAsignacion(Long id, AsignacionPersonalRequestDTO requestDTO) {
        AsignacionPersonalLogistico asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con ID: " + id));

        if (!asignacion.getEvento().getId().equals(requestDTO.getEventoId())) {
            if (asignacionRepository.existsByPersonalIdAndEventoIdAndActivoTrue(
                    requestDTO.getPersonalId(), requestDTO.getEventoId())) {
                throw new IllegalStateException("El personal ya está asignado a este evento");
            }
        }

        mapToEntity(requestDTO, asignacion);
        return mapToDTO(asignacionRepository.save(asignacion));
    }

    @Override
    @Transactional(readOnly = true)
    public AsignacionPersonalResponseDTO obtenerAsignacion(Long id) {
        return mapToDTO(asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con ID: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPersonalResponseDTO> obtenerTodos() {
        return asignacionRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPersonalResponseDTO> obtenerPorEvento(Long eventoId) {
        return asignacionRepository.findByEventoIdAndActivoTrue(eventoId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPersonalResponseDTO> obtenerPorPersonal(Long personalId) {
        return asignacionRepository.findByPersonalIdAndActivoTrue(personalId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<AsignacionPersonalResponseDTO> asignacionMasiva(Long eventoId, int cantidad, List<Long> excluirIds) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + eventoId));

        List<PersonalLogistico> disponibles = personalRepository.findByActivoTrue();

        List<Long> yaAsignados = asignacionRepository.findByEventoIdAndActivoTrue(eventoId).stream()
                .map(a -> a.getPersonal().getId())
                .collect(Collectors.toList());

        if (excluirIds != null) yaAsignados.addAll(excluirIds);
        disponibles.removeIf(p -> yaAsignados.contains(p.getId()));

        if (disponibles.isEmpty()) {
            throw new IllegalStateException("No hay personal logístico disponible para asignar");
        }

        Collections.shuffle(disponibles);
        List<PersonalLogistico> seleccionados = disponibles.stream()
                .limit(Math.min(cantidad, disponibles.size()))
                .toList();

        List<AsignacionPersonalResponseDTO> resultados = new ArrayList<>();
        for (PersonalLogistico personal : seleccionados) {
            AsignacionPersonalLogistico asignacion = new AsignacionPersonalLogistico();
            asignacion.setPersonal(personal);
            asignacion.setEvento(evento);
            asignacion.setFechaAsignacion(LocalDateTime.now());
            asignacion.setActivo(true);
            resultados.add(mapToDTO(asignacionRepository.save(asignacion)));
        }

        return resultados;
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
    @Transactional
    public void desactivarAsignacion(Long id) {
        AsignacionPersonalLogistico asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación no encontrada con ID: " + id));
        asignacion.setActivo(false);
        asignacionRepository.save(asignacion);
    }

    private void mapToEntity(AsignacionPersonalRequestDTO dto, AsignacionPersonalLogistico entity) {
        PersonalLogistico personal = personalRepository.findById(dto.getPersonalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Personal logístico no encontrado con ID: " + dto.getPersonalId()));
        entity.setPersonal(personal);

        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Evento no encontrado con ID: " + dto.getEventoId()));
        entity.setEvento(evento);

        entity.setRolAsignado(dto.getRolAsignado());
        if (entity.getFechaAsignacion() == null) {
            entity.setFechaAsignacion(LocalDateTime.now());
        }
    }

    private AsignacionPersonalResponseDTO mapToDTO(AsignacionPersonalLogistico entity) {
        AsignacionPersonalResponseDTO dto = new AsignacionPersonalResponseDTO();
        dto.setId(entity.getId());
        dto.setPersonalId(entity.getPersonal().getId());
        dto.setNombrePersonal(entity.getPersonal().getNombre());
        dto.setApellidoPersonal(entity.getPersonal().getApellido());
        dto.setNumeroCamiseta(entity.getPersonal().getNumeroCamiseta());
        dto.setCodigoQr(entity.getPersonal().getCodigoQr());
        dto.setEventoId(entity.getEvento().getId());
        dto.setNombreEvento(entity.getEvento().getNombre());
        dto.setRolAsignado(entity.getRolAsignado());
        dto.setFechaAsignacion(entity.getFechaAsignacion());
        dto.setActivo(entity.isActivo());
        return dto;
    }
}
