package com.festival.application.dto.cartera;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CarteraResumenDTO {
    private Long personalId;
    private String nombrePersonal;
    private BigDecimal totalPendiente;
    private List<CarteraLogisticoDTO> registros;
}
