package com.festival.application.usecase.evento;

import com.festival.application.dto.evento.EventoRequestDTO;
import com.festival.application.dto.evento.EventoResponseDTO;

import java.util.List;

public interface EventoUseCase {
    EventoResponseDTO crearEvento(EventoRequestDTO requestDTO);
    EventoResponseDTO actualizarEvento(Long id, EventoRequestDTO requestDTO);
    EventoResponseDTO obtenerEvento(Long id);
    List<EventoResponseDTO> obtenerTodos();
    List<EventoResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarEvento(Long id);
}
