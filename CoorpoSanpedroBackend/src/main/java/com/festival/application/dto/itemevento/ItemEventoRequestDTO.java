package com.festival.application.dto.itemevento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemEventoRequestDTO {
    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    @NotNull(message = "El ID de la resolución es obligatorio")
    private Long resolucionId;

    @NotBlank(message = "El detalle es obligatorio")
    private String detalle;

    @NotBlank(message = "La unidad es obligatoria")
    private String unidad;

    @NotNull(message = "La cantidad es obligatoria")
    private BigDecimal cantidad;

    @NotNull(message = "El valor unitario es obligatorio")
    private BigDecimal valorUnitario;

    @NotNull(message = "El valor ejecutado es obligatorio")
    private BigDecimal valorEjecutado;

    private String estado;
}
