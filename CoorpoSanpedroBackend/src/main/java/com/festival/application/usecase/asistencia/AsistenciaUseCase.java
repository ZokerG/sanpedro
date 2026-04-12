package com.festival.application.usecase.asistencia;

import com.festival.application.dto.asistencia.EscanearQrRequestDTO;
import com.festival.application.dto.asistencia.EscanearQrResponseDTO;
import com.festival.application.dto.asistencia.RegistroAsistenciaDTO;

import java.util.List;

public interface AsistenciaUseCase {

    /**
     * Procesa el escaneo de un QR:
     * - Si tiene asignación activa y es el primer ingreso → INGRESO + asistio = true
     * - Si ya registró ingreso → SALIDA
     * - Si no tiene asignación activa al evento → RECHAZADO
     */
    EscanearQrResponseDTO escanear(EscanearQrRequestDTO dto);

    /**
     * Lista todos los registros de asistencia de un evento en tiempo real.
     */
    List<RegistroAsistenciaDTO> obtenerPorEvento(Long eventoId);
}
