package com.festival.application.dto.tipocuenta;

import lombok.Data;

@Data
public class TipoCuentaBancariaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private boolean activo;
}
