package com.festival.application.dto.jornada;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardOperativoDTO {

    private int totalActivos;
    private int totalEnRuta;
    private int totalEnPausa;
    private int totalJornadasActivas;
    private List<JornadaResponseDTO> personalEnCampo;
}
