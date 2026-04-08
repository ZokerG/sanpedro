package com.festival.application.usecase.asignacionpool;

import com.festival.application.dto.asignacionpool.AsignacionPoolRequestDTO;
import com.festival.application.dto.asignacionpool.AsignacionPoolResponseDTO;

import java.util.List;

public interface AsignacionPoolUseCase {
    AsignacionPoolResponseDTO crearAsignacion(AsignacionPoolRequestDTO requestDTO);
    AsignacionPoolResponseDTO actualizarAsignacion(Long id, AsignacionPoolRequestDTO requestDTO);
    AsignacionPoolResponseDTO obtenerAsignacion(Long id);
    List<AsignacionPoolResponseDTO> obtenerTodos();
    List<AsignacionPoolResponseDTO> obtenerPorPool(Long poolId);
    List<AsignacionPoolResponseDTO> obtenerPorEvento(Long eventoId);
    void eliminarAsignacion(Long id);
}
