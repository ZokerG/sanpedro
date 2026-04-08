package com.festival.application.dto.servicioperiodo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ServicioPeriodoResponseDTO {
    private Long id;
    private Long festivalId;
    private Long resolucionId;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal valorTotal;
    private BigDecimal valorEjecutado;
    private String descripcion;
}
