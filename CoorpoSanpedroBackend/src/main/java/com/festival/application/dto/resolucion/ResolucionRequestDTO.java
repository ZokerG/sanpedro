package com.festival.application.dto.resolucion;

import com.festival.entity.TipoResolucion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ResolucionRequestDTO {
    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotBlank(message = "El número de la resolución es obligatorio")
    private String numero;

    @NotNull(message = "La fecha de la resolución es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "El tipo de resolución es obligatorio")
    private TipoResolucion tipo;

    private BigDecimal valorAdicion;

    private String cdpNumero;

    private String descripcion;
}
