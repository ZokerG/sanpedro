package com.festival.application.dto.sector;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SectorRequestDTO {
    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotBlank(message = "El nombre del sector es obligatorio")
    private String nombre;

    private String color;

    private Long responsableId;

    private boolean activo = true;
}
