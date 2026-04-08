package com.festival.application.dto.novedad;

import com.festival.entity.EntidadNovedad;
import lombok.Data;

@Data
public class NovedadResponseDTO {
    private Long id;
    private Long festivalId;
    private EntidadNovedad tipoEntidad;
    private Long entidadId;
    private String descripcion;
    private Long registradoPorId;
    private String registradoPorNombre;
}
