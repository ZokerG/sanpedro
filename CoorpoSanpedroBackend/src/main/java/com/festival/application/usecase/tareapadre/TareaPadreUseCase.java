package com.festival.application.usecase.tareapadre;

import com.festival.application.dto.tareapadre.TareaPadreRequestDTO;
import com.festival.application.dto.tareapadre.TareaPadreResponseDTO;

import java.util.List;

public interface TareaPadreUseCase {
    TareaPadreResponseDTO crearTareaPadre(TareaPadreRequestDTO requestDTO);
    TareaPadreResponseDTO actualizarTareaPadre(Long id, TareaPadreRequestDTO requestDTO);
    TareaPadreResponseDTO obtenerTareaPadre(Long id);
    List<TareaPadreResponseDTO> obtenerTodos();
    List<TareaPadreResponseDTO> obtenerPorEvento(Long eventoId);
    void eliminarTareaPadre(Long id);
}
