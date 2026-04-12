package com.festival.application.usecase.solicitud;

import com.festival.application.dto.solicitud.SolicitudParticipacionDTO;
import com.festival.application.dto.solicitud.SolicitudParticipacionRequestDTO;

import java.util.List;

public interface SolicitudParticipacionUseCase {

    /** Personal logístico solicita participar en un evento */
    SolicitudParticipacionDTO crearSolicitud(Long personalId, SolicitudParticipacionRequestDTO requestDTO);

    /** Mis solicitudes */
    List<SolicitudParticipacionDTO> obtenerMisSolicitudes(Long personalId);

    /** Solicitudes para un evento (admin) */
    List<SolicitudParticipacionDTO> obtenerPorEvento(Long eventoId);

    /** Solicitudes pendientes para un evento */
    List<SolicitudParticipacionDTO> obtenerPendientesPorEvento(Long eventoId);

    /** Administrador aprueba la solicitud (crea AsignacionPersonal) */
    SolicitudParticipacionDTO aprobarSolicitud(Long solicitudId);

    /** Administrador rechaza la solicitud */
    SolicitudParticipacionDTO rechazarSolicitud(Long solicitudId, String notaRechazo);

    /** Personal cancela su solicitud */
    void cancelarSolicitud(Long solicitudId);

    /** Obtener una solicitud por ID */
    SolicitudParticipacionDTO obtenerSolicitud(Long id);
}
