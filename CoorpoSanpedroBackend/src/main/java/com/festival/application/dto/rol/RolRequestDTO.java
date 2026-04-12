package com.festival.application.dto.rol;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RolRequestDTO {
    @NotBlank(message = "El nombre del rol es obligatorio")
    private String nombre;
    private String descripcion;
}
