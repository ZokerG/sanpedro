package com.festival.application.service.evento;

import com.festival.application.dto.evento.EventoRequestDTO;
import com.festival.application.dto.evento.EventoResponseDTO;
import com.festival.application.usecase.evento.EventoUseCase;
import com.festival.entity.Evento;
import com.festival.infrastructure.persistence.repository.AsignacionPersonalRepository;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventoServiceImpl implements EventoUseCase {

    private final EventoRepository eventoRepository;
    private final AsignacionPersonalRepository asignacionRepository;

    @Override
    @Transactional
    public EventoResponseDTO crearEvento(EventoRequestDTO requestDTO) {
        Evento evento = new Evento();
        mapToEntity(requestDTO, evento);
        Evento guardado = eventoRepository.save(evento);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public EventoResponseDTO actualizarEvento(Long id, EventoRequestDTO requestDTO) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + id));
        mapToEntity(requestDTO, evento);
        Evento actualizado = eventoRepository.save(evento);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public EventoResponseDTO obtenerEvento(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + id));
        return mapToDTO(evento);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventoResponseDTO> obtenerTodos() {
        return eventoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarEvento(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento no encontrado con ID: " + id);
        }
        eventoRepository.deleteById(id);
    }

    // ─── Mappers ─────────────────────────────────────────────────────────────

    private void mapToEntity(EventoRequestDTO dto, Evento entity) {
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFechaInicio(dto.getFechaInicio());
        // Calcular fechaFin a partir de duracionHoras
        entity.setDuracionHoras(dto.getDuracionHoras());
        entity.setPresupuestoAprobado(dto.getPresupuestoAprobado());
        entity.setPresupuestoEjecutado(dto.getPresupuestoEjecutado());
        entity.setEstado(dto.getEstado());
        entity.setPrioridad(dto.getPrioridad());
        entity.setUbicacionLogistica(dto.getUbicacionLogistica());
        entity.setLimitePersonal(dto.getLimitePersonal());
        entity.setCuotaPago(dto.getCuotaPago());
    }

    private EventoResponseDTO mapToDTO(Evento entity) {
        EventoResponseDTO dto = new EventoResponseDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setDuracionHoras(entity.getDuracionHoras());
        dto.setPresupuestoAprobado(entity.getPresupuestoAprobado());
        dto.setPresupuestoEjecutado(entity.getPresupuestoEjecutado());
        dto.setEstado(entity.getEstado());
        dto.setPrioridad(entity.getPrioridad());
        dto.setUbicacionLogistica(entity.getUbicacionLogistica());
        dto.setLimitePersonal(entity.getLimitePersonal());
        dto.setCuotaPago(entity.getCuotaPago());
        dto.setTotalAsignados(asignacionRepository.countActivasByEventoId(entity.getId()));
        return dto;
    }
}
