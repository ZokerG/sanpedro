package com.festival.application.dto.usoservicioperiodo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UsoServicioPeriodoResponseDTO {
    private Long id;
    private Long servicioId;
    private Long eventoId;
    private LocalDate fechaUso;
    private String descripcionUso;
}
