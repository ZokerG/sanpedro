package com.festival.application.dto.evento;

import com.festival.entity.EstadoEvento;
import com.festival.entity.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventoRequestDTO {
    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private BigDecimal presupuestoAprobado;

    private BigDecimal presupuestoEjecutado;

    @NotNull(message = "El estado del evento es obligatorio")
    private EstadoEvento estado;

    @NotNull(message = "La prioridad del evento es obligatoria")
    private Prioridad prioridad;
}
