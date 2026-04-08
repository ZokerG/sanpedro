package com.festival.application.dto.subtarea;

import com.festival.entity.EstadoSubtarea;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubTareaRequestDTO {

    @NotNull(message = "El ID de la Tarea Padre es obligatorio")
    private Long tareaPadreId;

    private Long sectorId;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;

    private Long responsableId;

    private LocalDate fechaLimite;

    @NotNull(message = "El estado es obligatorio")
    private EstadoSubtarea estado;

    private BigDecimal valorComprometido;

    private BigDecimal valorEjecutado;
}
