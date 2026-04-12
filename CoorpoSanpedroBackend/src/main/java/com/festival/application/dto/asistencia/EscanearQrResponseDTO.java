package com.festival.application.dto.asistencia;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EscanearQrResponseDTO {

    public enum ResultadoEscaneo {
        INGRESO, SALIDA, RECHAZADO
    }

    private ResultadoEscaneo resultado;
    private String mensaje;
    private String nombrePersonal;
    private String documento;
    private Integer numeroCamiseta;
    private String rolAsignado;
    private Long registroId;
}
