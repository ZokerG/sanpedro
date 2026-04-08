package com.festival.application.usecase.novedad;

import com.festival.application.dto.novedad.NovedadRequestDTO;
import com.festival.application.dto.novedad.NovedadResponseDTO;
import com.festival.entity.EntidadNovedad;

import java.util.List;

public interface NovedadUseCase {
    NovedadResponseDTO crearNovedad(NovedadRequestDTO requestDTO);
    NovedadResponseDTO actualizarNovedad(Long id, NovedadRequestDTO requestDTO);
    NovedadResponseDTO obtenerNovedad(Long id);
    List<NovedadResponseDTO> obtenerTodos();
    List<NovedadResponseDTO> obtenerPorFestival(Long festivalId);
    List<NovedadResponseDTO> obtenerPorEntidad(EntidadNovedad tipoEntidad, Long entidadId);
    void eliminarNovedad(Long id);
}
