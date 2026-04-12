package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Registro de lo que CorpoSanpedro debe pagar a un logístico por su asistencia a un evento.
 * Se genera automáticamente al ejecutar la liquidación del evento para cada asistente (asistio = true).
 * No es un pago en sí, sino la base para generar la cuenta de cobro.
 */
@Entity
@Table(
    name = "cartera_logistico",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_cartera_personal_evento",
        columnNames = {"personal_id", "evento_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class CarteraLogistico extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(name = "monto", nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Column(name = "fecha_liquidacion", nullable = false)
    private LocalDateTime fechaLiquidacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 30)
    private EstadoCartera estado = EstadoCartera.PENDIENTE_COBRO;

    @Column(name = "nota", columnDefinition = "TEXT")
    private String nota;
}
