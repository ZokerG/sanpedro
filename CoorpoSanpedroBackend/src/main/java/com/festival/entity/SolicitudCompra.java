package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_compra")
@Getter
@Setter
@NoArgsConstructor
public class SolicitudCompra extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(nullable = false, length = 500)
    private String motivo;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CategoriaCompra categoria;

    @Column(name = "foto_ruta")
    private String fotoRuta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoSolicitudCompra estado = EstadoSolicitudCompra.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobador_id")
    private Usuario aprobador;

    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    @Column(name = "comprobante_transferencia_ruta")
    private String comprobanteTransferenciaRuta;

    @Column(name = "fecha_transferencia")
    private LocalDateTime fechaTransferencia;

    @Column(name = "nota_rechazo", columnDefinition = "TEXT")
    private String notaRechazo;
}
