package com.festival.application.usecase.asignacionpersonal;

import com.festival.application.dto.asignacionpersonal.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacionpersonal.AsignacionPersonalResponseDTO;

import java.util.List;

public interface AsignacionPersonalUseCase {

    AsignacionPersonalResponseDTO crearAsignacion(AsignacionPersonalRequestDTO requestDTO);

    AsignacionPersonalResponseDTO actualizarAsignacion(Long id, AsignacionPersonalRequestDTO requestDTO);

    AsignacionPersonalResponseDTO obtenerAsignacion(Long id);

    List<AsignacionPersonalResponseDTO> obtenerTodos();

    List<AsignacionPersonalResponseDTO> obtenerPorEvento(Long eventoId);

    List<AsignacionPersonalResponseDTO> obtenerPorPersonal(Long personalId);

    List<AsignacionPersonalResponseDTO> asignacionMasiva(Long eventoId, int cantidad, List<Long> excluirIds);

    void eliminarAsignacion(Long id);

    void desactivarAsignacion(Long id);
}
