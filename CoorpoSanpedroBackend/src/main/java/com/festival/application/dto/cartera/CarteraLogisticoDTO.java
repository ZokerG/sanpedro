package com.festival.application.dto.cartera;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CarteraLogisticoDTO {
    private Long id;
    private Long personalId;
    private Long eventoId;
    private String nombreEvento;
    private String ubicacionEvento;
    private BigDecimal monto;
    private LocalDateTime fechaLiquidacion;
    private String estado;
    private String nota;
}
