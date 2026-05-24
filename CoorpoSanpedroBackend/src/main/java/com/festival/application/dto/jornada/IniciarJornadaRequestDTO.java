package com.festival.application.dto.jornada;

import com.festival.entity.EstadoJornada;
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
public class IniciarJornadaRequestDTO {

    private Long eventoId;
}
