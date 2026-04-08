package com.festival.application.dto.usoservicioperiodo;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UsoServicioPeriodoRequestDTO {

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long servicioId;

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    @NotNull(message = "La fecha de uso es obligatoria")
    private LocalDate fechaUso;

    private String descripcionUso;
}
