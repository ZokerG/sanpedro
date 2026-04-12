package com.festival.application.dto.tipocuenta;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TipoCuentaBancariaRequestDTO {
    @NotBlank(message = "El nombre del tipo de cuenta es obligatorio")
    private String nombre;
    private String descripcion;
}
