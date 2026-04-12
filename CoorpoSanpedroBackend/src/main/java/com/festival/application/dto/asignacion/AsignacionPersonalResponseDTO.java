package com.festival.application.dto.asignacion;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AsignacionPersonalResponseDTO {
    private Long id;
    private Long personalId;
    private String nombrePersonal;
    private String apellidoPersonal;
    private String documentoPersonal;
    private Integer numeroCamiseta;
    private Long eventoId;
    private String nombreEvento;
    private String rolAsignado;
    private LocalDateTime fechaAsignacion;
    private boolean asistio;
    private boolean activo;
}
