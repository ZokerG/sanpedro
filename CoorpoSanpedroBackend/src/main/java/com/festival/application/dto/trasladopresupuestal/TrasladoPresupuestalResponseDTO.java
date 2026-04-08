package com.festival.application.dto.trasladopresupuestal;

import com.festival.entity.EstadoTraslado;
import com.festival.entity.TipoTrasladoItem;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TrasladoPresupuestalResponseDTO {
    private Long id;
    private Long festivalId;
    private Long resolucionRespaldoId;
    private TipoTrasladoItem tipoOrigen;
    private Long idOrigen;
    private TipoTrasladoItem tipoDestino;
    private Long idDestino;
    private BigDecimal valor;
    private String justificacion;
    private Long aprobadoPorId;
    private String aprobadoPorNombre;
    private EstadoTraslado estado;
}
