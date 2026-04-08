package com.festival.application.usecase.servicioperiodo;

import com.festival.application.dto.servicioperiodo.ServicioPeriodoRequestDTO;
import com.festival.application.dto.servicioperiodo.ServicioPeriodoResponseDTO;

import java.util.List;

public interface ServicioPeriodoUseCase {
    ServicioPeriodoResponseDTO crearServicioPeriodo(ServicioPeriodoRequestDTO requestDTO);
    ServicioPeriodoResponseDTO actualizarServicioPeriodo(Long id, ServicioPeriodoRequestDTO requestDTO);
    ServicioPeriodoResponseDTO obtenerServicioPeriodo(Long id);
    List<ServicioPeriodoResponseDTO> obtenerTodos();
    List<ServicioPeriodoResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarServicioPeriodo(Long id);
}
