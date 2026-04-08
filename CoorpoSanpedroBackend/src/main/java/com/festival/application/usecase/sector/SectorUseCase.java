package com.festival.application.usecase.sector;

import com.festival.application.dto.sector.SectorRequestDTO;
import com.festival.application.dto.sector.SectorResponseDTO;

import java.util.List;

public interface SectorUseCase {
    SectorResponseDTO crearSector(SectorRequestDTO requestDTO);
    SectorResponseDTO actualizarSector(Long id, SectorRequestDTO requestDTO);
    SectorResponseDTO obtenerSector(Long id);
    List<SectorResponseDTO> obtenerTodos();
    List<SectorResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarSector(Long id);
}
