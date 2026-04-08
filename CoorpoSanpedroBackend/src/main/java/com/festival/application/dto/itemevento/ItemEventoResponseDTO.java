package com.festival.application.dto.itemevento;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemEventoResponseDTO {
    private Long id;
    private Long eventoId;
    private Long resolucionId;
    private String detalle;
    private String unidad;
    private BigDecimal cantidad;
    private BigDecimal valorUnitario;
    private BigDecimal valorTotal;
    private BigDecimal valorEjecutado;
    private String estado;
}
