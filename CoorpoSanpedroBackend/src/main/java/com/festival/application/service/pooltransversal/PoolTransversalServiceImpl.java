package com.festival.application.service.pooltransversal;

import com.festival.application.dto.pooltransversal.PoolTransversalRequestDTO;
import com.festival.application.dto.pooltransversal.PoolTransversalResponseDTO;
import com.festival.application.usecase.pooltransversal.PoolTransversalUseCase;
import com.festival.entity.Festival;
import com.festival.entity.PoolTransversal;
import com.festival.entity.Resolucion;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.PoolTransversalRepository;
import com.festival.infrastructure.persistence.repository.ResolucionRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PoolTransversalServiceImpl implements PoolTransversalUseCase {

    private final PoolTransversalRepository poolRepository;
    private final FestivalRepository festivalRepository;
    private final ResolucionRepository resolucionRepository;

    @Override
    @Transactional
    public PoolTransversalResponseDTO crearPool(PoolTransversalRequestDTO requestDTO) {
        PoolTransversal pool = new PoolTransversal();
        mapToEntity(requestDTO, pool);
        PoolTransversal guardado = poolRepository.save(pool);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public PoolTransversalResponseDTO actualizarPool(Long id, PoolTransversalRequestDTO requestDTO) {
        PoolTransversal pool = poolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pool transversal no encontrado con ID: " + id));
        mapToEntity(requestDTO, pool);
        PoolTransversal actualizado = poolRepository.save(pool);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public PoolTransversalResponseDTO obtenerPool(Long id) {
        PoolTransversal pool = poolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pool transversal no encontrado con ID: " + id));
        return mapToDTO(pool);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PoolTransversalResponseDTO> obtenerTodos() {
        return poolRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PoolTransversalResponseDTO> obtenerPorFestival(Long festivalId) {
        return poolRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarPool(Long id) {
        if (!poolRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pool transversal no encontrado con ID: " + id);
        }
        poolRepository.deleteById(id);
    }

    private void mapToEntity(PoolTransversalRequestDTO dto, PoolTransversal entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        Resolucion resolucion = resolucionRepository.findById(dto.getResolucionId())
                .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + dto.getResolucionId()));
        entity.setResolucion(resolucion);
        
        entity.setNombre(dto.getNombre());
        entity.setUnidad(dto.getUnidad());
        entity.setCantidadTotal(dto.getCantidadTotal());
        entity.setCantidadConsumida(dto.getCantidadConsumida());
        entity.setValorTotal(dto.getValorTotal());
        entity.setValorConsumido(dto.getValorConsumido());
        entity.setEstado(dto.getEstado());
    }

    private PoolTransversalResponseDTO mapToDTO(PoolTransversal entity) {
        PoolTransversalResponseDTO dto = new PoolTransversalResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        dto.setResolucionId(entity.getResolucion().getId());
        dto.setNombre(entity.getNombre());
        dto.setUnidad(entity.getUnidad());
        dto.setCantidadTotal(entity.getCantidadTotal());
        dto.setCantidadConsumida(entity.getCantidadConsumida());
        dto.setValorTotal(entity.getValorTotal());
        dto.setValorConsumido(entity.getValorConsumido());
        dto.setEstado(entity.getEstado());
        return dto;
    }
}
