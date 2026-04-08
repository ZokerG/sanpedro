package com.festival.application.service.tareapadre;

import com.festival.application.dto.tareapadre.TareaPadreRequestDTO;
import com.festival.application.dto.tareapadre.TareaPadreResponseDTO;
import com.festival.application.usecase.tareapadre.TareaPadreUseCase;
import com.festival.entity.AsignacionPool;
import com.festival.entity.Evento;
import com.festival.entity.ItemEvento;
import com.festival.entity.ServicioPeriodo;
import com.festival.entity.TareaPadre;
import com.festival.infrastructure.persistence.repository.AsignacionPoolRepository;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.ItemEventoRepository;
import com.festival.infrastructure.persistence.repository.ServicioPeriodoRepository;
import com.festival.infrastructure.persistence.repository.TareaPadreRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TareaPadreServiceImpl implements TareaPadreUseCase {

    private final TareaPadreRepository tareaPadreRepository;
    private final EventoRepository eventoRepository;
    private final ItemEventoRepository itemEventoRepository;
    private final AsignacionPoolRepository asignacionPoolRepository;
    private final ServicioPeriodoRepository servicioPeriodoRepository;

    @Override
    @Transactional
    public TareaPadreResponseDTO crearTareaPadre(TareaPadreRequestDTO requestDTO) {
        TareaPadre tareaPadre = new TareaPadre();
        mapToEntity(requestDTO, tareaPadre);
        TareaPadre guardada = tareaPadreRepository.save(tareaPadre);
        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public TareaPadreResponseDTO actualizarTareaPadre(Long id, TareaPadreRequestDTO requestDTO) {
        TareaPadre tareaPadre = tareaPadreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea Padre no encontrada con ID: " + id));
        mapToEntity(requestDTO, tareaPadre);
        TareaPadre actualizada = tareaPadreRepository.save(tareaPadre);
        return mapToDTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public TareaPadreResponseDTO obtenerTareaPadre(Long id) {
        TareaPadre tareaPadre = tareaPadreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea Padre no encontrada con ID: " + id));
        return mapToDTO(tareaPadre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaPadreResponseDTO> obtenerTodos() {
        return tareaPadreRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TareaPadreResponseDTO> obtenerPorEvento(Long eventoId) {
        return tareaPadreRepository.findByEventoId(eventoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarTareaPadre(Long id) {
        if (!tareaPadreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tarea Padre no encontrada con ID: " + id);
        }
        tareaPadreRepository.deleteById(id);
    }

    private void mapToEntity(TareaPadreRequestDTO dto, TareaPadre entity) {
        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));
        entity.setEvento(evento);
        
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrioridad(dto.getPrioridad());
        entity.setEstadoCalculado(dto.getEstadoCalculado());

        if (dto.getItemEventoId() != null) {
            ItemEvento item = itemEventoRepository.findById(dto.getItemEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("ItemEvento no encontrado con ID: " + dto.getItemEventoId()));
            entity.setItemEvento(item);
        } else {
            entity.setItemEvento(null);
        }

        if (dto.getAsignacionPoolId() != null) {
            AsignacionPool pool = asignacionPoolRepository.findById(dto.getAsignacionPoolId())
                .orElseThrow(() -> new ResourceNotFoundException("AsignacionPool no encontrado con ID: " + dto.getAsignacionPoolId()));
            entity.setAsignacionPool(pool);
        } else {
            entity.setAsignacionPool(null);
        }

        if (dto.getServicioId() != null) {
            ServicioPeriodo serv = servicioPeriodoRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("ServicioPeriodo no encontrado con ID: " + dto.getServicioId()));
            entity.setServicio(serv);
        } else {
            entity.setServicio(null);
        }
    }

    private TareaPadreResponseDTO mapToDTO(TareaPadre entity) {
        TareaPadreResponseDTO dto = new TareaPadreResponseDTO();
        dto.setId(entity.getId());
        dto.setEventoId(entity.getEvento().getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPrioridad(entity.getPrioridad());
        dto.setEstadoCalculado(entity.getEstadoCalculado());

        if (entity.getItemEvento() != null) {
            dto.setItemEventoId(entity.getItemEvento().getId());
        }
        if (entity.getAsignacionPool() != null) {
            dto.setAsignacionPoolId(entity.getAsignacionPool().getId());
        }
        if (entity.getServicio() != null) {
            dto.setServicioId(entity.getServicio().getId());
        }

        return dto;
    }
}
