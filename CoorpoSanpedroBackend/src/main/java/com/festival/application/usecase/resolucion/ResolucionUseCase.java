package com.festival.application.usecase.resolucion;

import com.festival.application.dto.resolucion.ResolucionRequestDTO;
import com.festival.application.dto.resolucion.ResolucionResponseDTO;

import java.util.List;

public interface ResolucionUseCase {
    ResolucionResponseDTO crearResolucion(ResolucionRequestDTO requestDTO);
    ResolucionResponseDTO actualizarResolucion(Long id, ResolucionRequestDTO requestDTO);
    ResolucionResponseDTO obtenerResolucion(Long id);
    List<ResolucionResponseDTO> obtenerTodos();
    List<ResolucionResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarResolucion(Long id);
}
