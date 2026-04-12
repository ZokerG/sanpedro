package com.festival.application.usecase.asignacion;

import com.festival.application.dto.asignacion.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacion.AsignacionPersonalResponseDTO;
import com.festival.application.dto.asignacion.LiquidacionEventoDTO;

import java.util.List;

public interface AsignacionPersonalUseCase {
    AsignacionPersonalResponseDTO crearAsignacion(AsignacionPersonalRequestDTO requestDTO);
    List<AsignacionPersonalResponseDTO> obtenerPorEvento(Long eventoId);
    List<AsignacionPersonalResponseDTO> obtenerPorPersonal(Long personalId);
    void confirmarAsistencia(Long asignacionId);
    void desactivarAsignacion(Long id);
    void eliminarAsignacion(Long id);
    LiquidacionEventoDTO liquidarEvento(Long eventoId);
}
