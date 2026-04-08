package com.festival.application.usecase.itemevento;

import com.festival.application.dto.itemevento.ItemEventoRequestDTO;
import com.festival.application.dto.itemevento.ItemEventoResponseDTO;

import java.util.List;

public interface ItemEventoUseCase {
    ItemEventoResponseDTO crearItemEvento(ItemEventoRequestDTO requestDTO);
    ItemEventoResponseDTO actualizarItemEvento(Long id, ItemEventoRequestDTO requestDTO);
    ItemEventoResponseDTO obtenerItemEvento(Long id);
    List<ItemEventoResponseDTO> obtenerTodos();
    List<ItemEventoResponseDTO> obtenerPorEvento(Long eventoId);
    void eliminarItemEvento(Long id);
}
