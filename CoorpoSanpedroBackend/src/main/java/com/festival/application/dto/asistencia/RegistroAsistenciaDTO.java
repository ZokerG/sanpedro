package com.festival.application.dto.asistencia;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RegistroAsistenciaDTO {
    private Long id;
    private Long asignacionId;
    private Long personalId;
    private String nombrePersonal;
    private String documento;
    private Integer numeroCamiseta;
    private String tipo;
    private LocalDateTime timestampRegistro;
    private String registradoPor;
}
