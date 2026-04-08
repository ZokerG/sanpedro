package com.festival.application.dto.asignacionpersonal;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AsignacionPersonalResponseDTO {

    private Long id;

    private Long personalId;
    private String nombrePersonal;
    private String apellidoPersonal;
    private Integer numeroCamiseta;
    private String codigoQr;

    private Long eventoId;
    private String nombreEvento;

    private String rolAsignado;
    private LocalDateTime fechaAsignacion;
    private boolean activo;
}
