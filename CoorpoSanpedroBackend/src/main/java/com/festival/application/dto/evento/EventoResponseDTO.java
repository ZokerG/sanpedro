package com.festival.application.dto.evento;

import com.festival.entity.EstadoEvento;
import com.festival.entity.Prioridad;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventoResponseDTO {
    private Long id;
    private Long festivalId;
    private String festivalNombre;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private BigDecimal presupuestoAprobado;
    private BigDecimal presupuestoEjecutado;
    private EstadoEvento estado;
    private Prioridad prioridad;
}
