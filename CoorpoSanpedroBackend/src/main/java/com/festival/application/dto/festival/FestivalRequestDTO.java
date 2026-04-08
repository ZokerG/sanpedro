package com.festival.application.dto.festival;

import com.festival.entity.EstadoFestival;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FestivalRequestDTO {
    @NotBlank(message = "El nombre del festival es obligatorio")
    private String nombre;

    @NotNull(message = "La versión del festival es obligatoria")
    private Integer version;

    @NotNull(message = "El año del festival es obligatorio")
    private Integer anio;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate fechaFin;

    @NotNull(message = "El estado del festival es obligatorio")
    private EstadoFestival estado;
}
