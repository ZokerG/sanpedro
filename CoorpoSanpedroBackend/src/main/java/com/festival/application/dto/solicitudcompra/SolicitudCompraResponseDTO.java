package com.festival.application.dto.solicitudcompra;

import com.festival.entity.CategoriaCompra;
import com.festival.entity.EstadoSolicitudCompra;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SolicitudCompraResponseDTO {

    private Long id;
    private Long personalId;
    private String personalNombre;
    private String motivo;
    private BigDecimal monto;
    private CategoriaCompra categoria;
    private String fotoPresignedUrl;
    private EstadoSolicitudCompra estado;
    private Long aprobadorId;
    private String aprobadorNombre;
    private LocalDateTime fechaAprobacion;
    private String comprobanteTransferenciaPresignedUrl;
    private LocalDateTime fechaTransferencia;
    private String notaRechazo;
    private LocalDateTime createdAt;
}
