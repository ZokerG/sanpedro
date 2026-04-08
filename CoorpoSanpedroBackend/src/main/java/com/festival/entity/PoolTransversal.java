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
@Table(name = "pools_transversales")
@Getter
@Setter
@NoArgsConstructor
public class PoolTransversal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolucion_id", nullable = false)
    private Resolucion resolucion;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String unidad;

    @Column(name = "cantidad_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadTotal;

    @Column(name = "cantidad_consumida", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidadConsumida;

    @Column(name = "valor_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "valor_consumido", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorConsumido;

    @Column(length = 50)
    private String estado;
}
