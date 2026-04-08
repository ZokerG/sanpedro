package com.festival.application.dto.tareapadre;

import com.festival.entity.EstadoCalculado;
import com.festival.entity.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TareaPadreRequestDTO {

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;

    @NotNull(message = "La prioridad es obligatoria")
    private Prioridad prioridad;

    @NotNull(message = "El estado calculado es obligatorio")
    private EstadoCalculado estadoCalculado;

    // Relaciones opcionales a ítems
    private Long itemEventoId;
    
    private Long asignacionPoolId;
    
    private Long servicioId;
}
