package com.festival.application.usecase.festival;

import com.festival.application.dto.festival.FestivalRequestDTO;
import com.festival.application.dto.festival.FestivalResponseDTO;

import java.util.List;

public interface FestivalUseCase {
    FestivalResponseDTO crearFestival(FestivalRequestDTO requestDTO);
    FestivalResponseDTO actualizarFestival(Long id, FestivalRequestDTO requestDTO);
    FestivalResponseDTO obtenerFestival(Long id);
    List<FestivalResponseDTO> obtenerTodos();
    void eliminarFestival(Long id);
}
