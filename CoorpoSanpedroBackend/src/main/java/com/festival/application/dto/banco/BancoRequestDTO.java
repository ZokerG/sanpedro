package com.festival.application.dto.banco;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BancoRequestDTO {
    @NotBlank(message = "El nombre del banco es obligatorio")
    private String nombre;
    private String descripcion;
}
