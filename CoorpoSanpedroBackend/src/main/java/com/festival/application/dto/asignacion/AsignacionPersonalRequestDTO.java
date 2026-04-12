package com.festival.application.dto.asignacion;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AsignacionPersonalRequestDTO {
    private Long personalId;
    private Long eventoId;
    private String rolAsignado;
}
