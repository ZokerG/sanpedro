package com.festival.application.dto.noticia;

import lombok.Data;

@Data
public class NoticiaResponseDTO {

    private Long id;
    private String autorNombre;
    private String titulo;
    private String contenido;
    private String planta;
    private boolean destacada;
    private String fechaPublicacion;
    private String imagenPresignedUrl;
    private String createdAt;
}
