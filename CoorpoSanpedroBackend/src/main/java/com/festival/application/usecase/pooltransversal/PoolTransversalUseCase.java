package com.festival.application.usecase.pooltransversal;

import com.festival.application.dto.pooltransversal.PoolTransversalRequestDTO;
import com.festival.application.dto.pooltransversal.PoolTransversalResponseDTO;

import java.util.List;

public interface PoolTransversalUseCase {
    PoolTransversalResponseDTO crearPool(PoolTransversalRequestDTO requestDTO);
    PoolTransversalResponseDTO actualizarPool(Long id, PoolTransversalRequestDTO requestDTO);
    PoolTransversalResponseDTO obtenerPool(Long id);
    List<PoolTransversalResponseDTO> obtenerTodos();
    List<PoolTransversalResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarPool(Long id);
}
