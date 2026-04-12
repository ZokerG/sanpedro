package com.festival.application.dto.asistencia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EscanearQrRequestDTO {

    @NotBlank(message = "El código QR es obligatorio")
    private String codigoQr;

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    /** Usuario que opera el escáner (puede ser nulo si no hay autenticación en la app escáner) */
    private String registradoPor;
}
