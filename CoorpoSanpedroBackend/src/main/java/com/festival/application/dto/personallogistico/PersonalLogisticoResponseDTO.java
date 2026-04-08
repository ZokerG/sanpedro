package com.festival.application.dto.personallogistico;

import lombok.Data;

@Data
public class PersonalLogisticoResponseDTO {

    private Long id;
    private String nombre;
    private String apellido;
    private Integer numeroCamiseta;
    private String codigoQr;
    private boolean activo;
}
