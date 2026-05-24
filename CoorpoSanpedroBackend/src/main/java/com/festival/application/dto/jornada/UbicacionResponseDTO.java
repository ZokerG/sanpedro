package com.festival.application.dto.jornada;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionResponseDTO {

    private Long id;
    private Long jornadaId;
    private Long personalId;
    private Double latitud;
    private Double longitud;
    private Double precisionGps;
    private LocalDateTime timestamp;
}
