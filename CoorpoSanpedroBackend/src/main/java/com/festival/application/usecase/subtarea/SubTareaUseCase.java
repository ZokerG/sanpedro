package com.festival.application.usecase.subtarea;

import com.festival.application.dto.subtarea.SubTareaRequestDTO;
import com.festival.application.dto.subtarea.SubTareaResponseDTO;

import java.util.List;

public interface SubTareaUseCase {
    SubTareaResponseDTO crearSubTarea(SubTareaRequestDTO requestDTO);
    SubTareaResponseDTO actualizarSubTarea(Long id, SubTareaRequestDTO requestDTO);
    SubTareaResponseDTO obtenerSubTarea(Long id);
    List<SubTareaResponseDTO> obtenerTodos();
    List<SubTareaResponseDTO> obtenerPorTareaPadre(Long tareaPadreId);
    void eliminarSubTarea(Long id);
}
