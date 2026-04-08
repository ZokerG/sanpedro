package com.festival.application.dto.asignacionpersonal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AsignacionPersonalRequestDTO {

    @NotNull(message = "El ID del personal es obligatorio")
    private Long personalId;

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    private String rolAsignado;
}
