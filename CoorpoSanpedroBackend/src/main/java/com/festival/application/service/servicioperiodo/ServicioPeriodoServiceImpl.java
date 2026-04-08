package com.festival.application.service.servicioperiodo;

import com.festival.application.dto.servicioperiodo.ServicioPeriodoRequestDTO;
import com.festival.application.dto.servicioperiodo.ServicioPeriodoResponseDTO;
import com.festival.application.usecase.servicioperiodo.ServicioPeriodoUseCase;
import com.festival.entity.Festival;
import com.festival.entity.Resolucion;
import com.festival.entity.ServicioPeriodo;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.ResolucionRepository;
import com.festival.infrastructure.persistence.repository.ServicioPeriodoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServicioPeriodoServiceImpl implements ServicioPeriodoUseCase {

    private final ServicioPeriodoRepository servicioPeriodoRepository;
    private final FestivalRepository festivalRepository;
    private final ResolucionRepository resolucionRepository;

    @Override
    @Transactional
    public ServicioPeriodoResponseDTO crearServicioPeriodo(ServicioPeriodoRequestDTO requestDTO) {
        ServicioPeriodo servicio = new ServicioPeriodo();
        mapToEntity(requestDTO, servicio);
        ServicioPeriodo guardado = servicioPeriodoRepository.save(servicio);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public ServicioPeriodoResponseDTO actualizarServicioPeriodo(Long id, ServicioPeriodoRequestDTO requestDTO) {
        ServicioPeriodo servicio = servicioPeriodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio de periodo no encontrado con ID: " + id));
        mapToEntity(requestDTO, servicio);
        ServicioPeriodo actualizado = servicioPeriodoRepository.save(servicio);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public ServicioPeriodoResponseDTO obtenerServicioPeriodo(Long id) {
        ServicioPeriodo servicio = servicioPeriodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio de periodo no encontrado con ID: " + id));
        return mapToDTO(servicio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServicioPeriodoResponseDTO> obtenerTodos() {
        return servicioPeriodoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServicioPeriodoResponseDTO> obtenerPorFestival(Long festivalId) {
        return servicioPeriodoRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarServicioPeriodo(Long id) {
        if (!servicioPeriodoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Servicio de periodo no encontrado con ID: " + id);
        }
        servicioPeriodoRepository.deleteById(id);
    }

    private void mapToEntity(ServicioPeriodoRequestDTO dto, ServicioPeriodo entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        Resolucion resolucion = resolucionRepository.findById(dto.getResolucionId())
                .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + dto.getResolucionId()));
        entity.setResolucion(resolucion);
        
        entity.setNombre(dto.getNombre());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setValorTotal(dto.getValorTotal());
        entity.setValorEjecutado(dto.getValorEjecutado());
        entity.setDescripcion(dto.getDescripcion());
    }

    private ServicioPeriodoResponseDTO mapToDTO(ServicioPeriodo entity) {
        ServicioPeriodoResponseDTO dto = new ServicioPeriodoResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        dto.setResolucionId(entity.getResolucion().getId());
        dto.setNombre(entity.getNombre());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setValorTotal(entity.getValorTotal());
        dto.setValorEjecutado(entity.getValorEjecutado());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
