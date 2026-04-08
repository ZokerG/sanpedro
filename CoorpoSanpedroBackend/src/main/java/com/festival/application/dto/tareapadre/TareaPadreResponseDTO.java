package com.festival.application.dto.tareapadre;

import com.festival.entity.EstadoCalculado;
import com.festival.entity.Prioridad;
import lombok.Data;

@Data
public class TareaPadreResponseDTO {
    private Long id;
    private Long eventoId;
    private String titulo;
    private String descripcion;
    private Prioridad prioridad;
    private EstadoCalculado estadoCalculado;
    private Long itemEventoId;
    private Long asignacionPoolId;
    private Long servicioId;
}
