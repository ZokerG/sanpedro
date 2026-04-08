package com.festival.application.dto.asignacionpool;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AsignacionPoolResponseDTO {
    private Long id;
    private Long poolId;
    private Long eventoId;
    private BigDecimal cantidadAsignada;
    private BigDecimal cantidadEjecutada;
    private BigDecimal valorAsignado;
    private BigDecimal valorEjecutado;
}
