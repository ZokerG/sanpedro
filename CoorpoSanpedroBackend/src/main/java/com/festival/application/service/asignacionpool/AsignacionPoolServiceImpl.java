package com.festival.application.service.asignacionpool;

import com.festival.application.dto.asignacionpool.AsignacionPoolRequestDTO;
import com.festival.application.dto.asignacionpool.AsignacionPoolResponseDTO;
import com.festival.application.usecase.asignacionpool.AsignacionPoolUseCase;
import com.festival.entity.AsignacionPool;
import com.festival.entity.Evento;
import com.festival.entity.PoolTransversal;
import com.festival.infrastructure.persistence.repository.AsignacionPoolRepository;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.PoolTransversalRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsignacionPoolServiceImpl implements AsignacionPoolUseCase {

    private final AsignacionPoolRepository asignacionRepository;
    private final PoolTransversalRepository poolRepository;
    private final EventoRepository eventoRepository;

    @Override
    @Transactional
    public AsignacionPoolResponseDTO crearAsignacion(AsignacionPoolRequestDTO requestDTO) {
        AsignacionPool asignacion = new AsignacionPool();
        mapToEntity(requestDTO, asignacion);
        AsignacionPool guardada = asignacionRepository.save(asignacion);
        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public AsignacionPoolResponseDTO actualizarAsignacion(Long id, AsignacionPoolRequestDTO requestDTO) {
        AsignacionPool asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación de pool no encontrada con ID: " + id));
        mapToEntity(requestDTO, asignacion);
        AsignacionPool actualizada = asignacionRepository.save(asignacion);
        return mapToDTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public AsignacionPoolResponseDTO obtenerAsignacion(Long id) {
        AsignacionPool asignacion = asignacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asignación de pool no encontrada con ID: " + id));
        return mapToDTO(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPoolResponseDTO> obtenerTodos() {
        return asignacionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPoolResponseDTO> obtenerPorPool(Long poolId) {
        return asignacionRepository.findByPoolId(poolId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsignacionPoolResponseDTO> obtenerPorEvento(Long eventoId) {
        return asignacionRepository.findByEventoId(eventoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarAsignacion(Long id) {
        if (!asignacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asignación de pool no encontrada con ID: " + id);
        }
        asignacionRepository.deleteById(id);
    }

    private void mapToEntity(AsignacionPoolRequestDTO dto, AsignacionPool entity) {
        PoolTransversal pool = poolRepository.findById(dto.getPoolId())
                .orElseThrow(() -> new ResourceNotFoundException("Pool transversal no encontrado con ID: " + dto.getPoolId()));
        entity.setPool(pool);
        
        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));
        entity.setEvento(evento);

        entity.setCantidadAsignada(dto.getCantidadAsignada());
        entity.setCantidadEjecutada(dto.getCantidadEjecutada());
        entity.setValorAsignado(dto.getValorAsignado());
        entity.setValorEjecutado(dto.getValorEjecutado());
    }

    private AsignacionPoolResponseDTO mapToDTO(AsignacionPool entity) {
        AsignacionPoolResponseDTO dto = new AsignacionPoolResponseDTO();
        dto.setId(entity.getId());
        dto.setPoolId(entity.getPool().getId());
        dto.setEventoId(entity.getEvento().getId());
        dto.setCantidadAsignada(entity.getCantidadAsignada());
        dto.setCantidadEjecutada(entity.getCantidadEjecutada());
        dto.setValorAsignado(entity.getValorAsignado());
        dto.setValorEjecutado(entity.getValorEjecutado());
        return dto;
    }
}
