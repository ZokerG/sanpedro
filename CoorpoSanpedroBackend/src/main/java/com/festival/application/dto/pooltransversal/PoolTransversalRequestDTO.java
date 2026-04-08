package com.festival.application.dto.pooltransversal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PoolTransversalRequestDTO {
    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotNull(message = "El ID de la resolución es obligatorio")
    private Long resolucionId;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "La unidad es obligatoria")
    private String unidad;

    @NotNull(message = "La cantidad total es obligatoria")
    private BigDecimal cantidadTotal;

    @NotNull(message = "La cantidad consumida es obligatoria")
    private BigDecimal cantidadConsumida;

    @NotNull(message = "El valor total es obligatorio")
    private BigDecimal valorTotal;

    @NotNull(message = "El valor consumido es obligatorio")
    private BigDecimal valorConsumido;

    private String estado;
}
