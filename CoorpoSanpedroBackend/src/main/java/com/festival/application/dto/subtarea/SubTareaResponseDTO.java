package com.festival.application.dto.subtarea;

import com.festival.entity.EstadoSubtarea;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SubTareaResponseDTO {
    private Long id;
    private Long tareaPadreId;
    private Long sectorId;
    private String titulo;
    private String descripcion;
    private Long responsableId;
    private String responsableNombre;
    private LocalDate fechaLimite;
    private EstadoSubtarea estado;
    private BigDecimal valorComprometido;
    private BigDecimal valorEjecutado;
}
