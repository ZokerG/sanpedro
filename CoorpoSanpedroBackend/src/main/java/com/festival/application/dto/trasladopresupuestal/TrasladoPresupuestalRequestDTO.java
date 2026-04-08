package com.festival.application.dto.trasladopresupuestal;

import com.festival.entity.EstadoTraslado;
import com.festival.entity.TipoTrasladoItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TrasladoPresupuestalRequestDTO {
    @NotNull(message = "El ID del festival es obligatorio")
    private Long festivalId;

    private Long resolucionRespaldoId;

    @NotNull(message = "El tipo de origen es obligatorio")
    private TipoTrasladoItem tipoOrigen;

    @NotNull(message = "El ID de origen es obligatorio")
    private Long idOrigen;

    @NotNull(message = "El tipo de destino es obligatorio")
    private TipoTrasladoItem tipoDestino;

    @NotNull(message = "El ID de destino es obligatorio")
    private Long idDestino;

    @NotNull(message = "El valor es obligatorio")
    private BigDecimal valor;

    @NotBlank(message = "La justificación es obligatoria")
    private String justificacion;

    private Long aprobadoPorId;

    @NotNull(message = "El estado del traslado es obligatorio")
    private EstadoTraslado estado;
}
