package com.festival.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "asignaciones_pool")
@Getter
@Setter
@NoArgsConstructor
public class AsignacionPool extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pool_id", nullable = false)
    private PoolTransversal pool;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(name = "cantidad_asignada", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadAsignada;

    @Column(name = "cantidad_ejecutada", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadEjecutada;

    @Column(name = "valor_asignado", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorAsignado;

    @Column(name = "valor_ejecutado", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorEjecutado;
}
