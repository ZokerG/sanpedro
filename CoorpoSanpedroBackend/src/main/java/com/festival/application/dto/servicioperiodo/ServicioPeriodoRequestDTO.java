package com.festival.application.dto.servicioperiodo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServicioPeriodoRequestDTO {

    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotNull(message = "El ID de la resolución es obligatorio")
    private Long resolucionId;

    @NotBlank(message = "El nombre del servicio es obligatorio")
    private String nombre;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha final es obligatoria")
    private LocalDate fechaFin;

    @NotNull(message = "El valor total es obligatorio")
    private BigDecimal valorTotal;

    @NotNull(message = "El valor ejecutado es obligatorio")
    private BigDecimal valorEjecutado;

    private String descripcion;
}
