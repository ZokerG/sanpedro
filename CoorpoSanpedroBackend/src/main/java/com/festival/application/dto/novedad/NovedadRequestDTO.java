package com.festival.application.dto.novedad;

import com.festival.entity.EntidadNovedad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NovedadRequestDTO {

    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotNull(message = "El tipo de entidad es obligatorio")
    private EntidadNovedad tipoEntidad;

    @NotNull(message = "El ID de la entidad es obligatorio")
    private Long entidadId;

    @NotBlank(message = "La descripción de la novedad es obligatoria")
    private String descripcion;

    @NotNull(message = "El ID del usuario que registra es obligatorio")
    private Long registradoPorId;
}
