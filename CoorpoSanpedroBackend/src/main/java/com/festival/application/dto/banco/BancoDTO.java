package com.festival.application.dto.banco;

import lombok.Data;

@Data
public class BancoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private boolean activo;
}
