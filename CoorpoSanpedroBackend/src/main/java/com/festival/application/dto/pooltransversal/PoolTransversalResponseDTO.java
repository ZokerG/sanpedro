package com.festival.application.dto.pooltransversal;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PoolTransversalResponseDTO {
    private Long id;
    private Long festivalId;
    private Long resolucionId;
    private String nombre;
    private String unidad;
    private BigDecimal cantidadTotal;
    private BigDecimal cantidadConsumida;
    private BigDecimal valorTotal;
    private BigDecimal valorConsumido;
    private String estado;
}
