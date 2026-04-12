package com.festival.application.dto.asignacion;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LiquidacionEventoDTO {
    private Long eventoId;
    private String nombreEvento;
    private int totalAsignados;
    private int totalAsistentes;
    private BigDecimal cuotaPago;
    private BigDecimal costoReal;
    private BigDecimal presupuestoAprobado;
    private BigDecimal diferencia;    // presupuesto - costoReal (positivo = ahorro, negativo = déficit)
    private String estado;            // "DENTRO_PRESUPUESTO" | "DEFICIT"
}
