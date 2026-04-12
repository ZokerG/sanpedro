package com.festival.application.dto.rol;

import lombok.Data;

@Data
public class RolDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private boolean activo;
}
