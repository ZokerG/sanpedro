package com.festival.application.dto.resolucion;

import com.festival.entity.TipoResolucion;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ResolucionResponseDTO {
    private Long id;
    private Long festivalId;
    private String festivalNombre;
    private String numero;
    private LocalDate fecha;
    private TipoResolucion tipo;
    private BigDecimal valorAdicion;
    private String cdpNumero;
    private String descripcion;
}
