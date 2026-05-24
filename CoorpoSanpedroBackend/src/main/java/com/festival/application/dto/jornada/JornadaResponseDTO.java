package com.festival.application.dto.jornada;

import com.festival.entity.EstadoJornada;
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
public class JornadaResponseDTO {

    private Long id;
    private Long personalId;
    private String nombrePersonal;
    private String documento;
    private Integer numeroCamiseta;
    private String fotoPerfil;
    private Long eventoId;
    private String nombreEvento;
    private EstadoJornada estado;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private UbicacionResponseDTO ultimaUbicacion;
}
