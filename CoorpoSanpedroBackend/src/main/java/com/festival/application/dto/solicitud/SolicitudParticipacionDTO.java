package com.festival.application.dto.solicitud;

import com.festival.entity.EstadoSolicitud;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SolicitudParticipacionDTO {
    private Long id;
    private Long personalId;
    private String personalNombre;
    private String personalDocumento;
    private Long eventoId;
    private String eventoNombre;
    private EstadoSolicitud estado;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaResolucion;
    private String notaRechazo;
    private String rolAsignado;
    private Long asignacionId;
}
