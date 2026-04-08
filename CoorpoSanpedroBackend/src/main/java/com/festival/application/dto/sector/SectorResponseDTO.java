package com.festival.application.dto.sector;

import lombok.Data;

@Data
public class SectorResponseDTO {
    private Long id;
    private Long festivalId;
    private String festivalNombre;
    private String nombre;
    private String color;
    private Long responsableId;
    private String responsableNombre;
    private boolean activo;
}
