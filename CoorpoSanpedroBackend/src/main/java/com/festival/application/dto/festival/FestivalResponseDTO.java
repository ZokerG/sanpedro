package com.festival.application.dto.festival;

import com.festival.entity.EstadoFestival;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FestivalResponseDTO {
    private Long id;
    private String nombre;
    private Integer version;
    private Integer anio;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private EstadoFestival estado;
}
