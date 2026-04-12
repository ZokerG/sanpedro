package com.festival.application.dto.solicitud;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SolicitudParticipacionRequestDTO {

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    /** Rol o puesto que desea desempeñar (opcional) */
    private String rolAsignado;
}
