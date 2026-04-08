package com.festival.application.usecase.usoservicioperiodo;

import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoRequestDTO;
import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoResponseDTO;

import java.util.List;

public interface UsoServicioPeriodoUseCase {
    UsoServicioPeriodoResponseDTO crearUso(UsoServicioPeriodoRequestDTO requestDTO);
    UsoServicioPeriodoResponseDTO actualizarUso(Long id, UsoServicioPeriodoRequestDTO requestDTO);
    UsoServicioPeriodoResponseDTO obtenerUso(Long id);
    List<UsoServicioPeriodoResponseDTO> obtenerTodos();
    List<UsoServicioPeriodoResponseDTO> obtenerPorServicio(Long servicioId);
    List<UsoServicioPeriodoResponseDTO> obtenerPorEvento(Long eventoId);
    void eliminarUso(Long id);
}
