package com.festival.application.usecase.jornada;

import com.festival.application.dto.jornada.*;

import java.util.List;

public interface JornadaUseCase {

    JornadaResponseDTO iniciarJornada(Long personalId, IniciarJornadaRequestDTO dto);

    JornadaResponseDTO cambiarEstado(Long jornadaId, CambiarEstadoRequestDTO dto);

    UbicacionResponseDTO reportarUbicacion(Long jornadaId, UbicacionRequestDTO dto);

    JornadaResponseDTO obtenerJornadaActiva(Long personalId);

    List<JornadaResponseDTO> obtenerJornadasActivas();

    DashboardOperativoDTO obtenerDashboardOperativo();
}
