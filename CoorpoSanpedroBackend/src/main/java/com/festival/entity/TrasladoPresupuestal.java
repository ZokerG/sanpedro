package com.festival.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "traslados_presupuestales")
@Getter
@Setter
@NoArgsConstructor
public class TrasladoPresupuestal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolucion_id") // Nullable para cuando está PENDIENTE
    private Resolucion resolucionRespaldo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_origen", length = 50)
    private TipoTrasladoItem tipoOrigen;

    @Column(name = "id_origen")
    private Long idOrigen;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_destino", length = 50)
    private TipoTrasladoItem tipoDestino;

    @Column(name = "id_destino")
    private Long idDestino;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String justificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobado_por_id")
    private Usuario aprobadoPor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EstadoTraslado estado;
}
