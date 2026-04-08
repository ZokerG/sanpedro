package com.festival.application.dto.asignacionpool;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AsignacionPoolRequestDTO {

    @NotNull(message = "El ID del pool es obligatorio")
    private Long poolId;

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    @NotNull(message = "La cantidad asignada es obligatoria")
    private BigDecimal cantidadAsignada;

    @NotNull(message = "La cantidad ejecutada es obligatoria")
    private BigDecimal cantidadEjecutada;

    @NotNull(message = "El valor asignado es obligatorio")
    private BigDecimal valorAsignado;

    @NotNull(message = "El valor ejecutado es obligatorio")
    private BigDecimal valorEjecutado;
}
