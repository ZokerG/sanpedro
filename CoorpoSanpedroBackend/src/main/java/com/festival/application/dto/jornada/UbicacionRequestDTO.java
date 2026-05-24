package com.festival.application.dto.jornada;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionRequestDTO {

    @NotNull
    private Double latitud;

    @NotNull
    private Double longitud;

    private Double precisionGps;
}
