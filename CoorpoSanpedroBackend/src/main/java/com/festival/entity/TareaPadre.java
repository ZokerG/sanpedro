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

@Entity
@Table(name = "tareas_padre")
@Getter
@Setter
@NoArgsConstructor
public class TareaPadre extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Prioridad prioridad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_calculado", nullable = false, length = 50)
    private EstadoCalculado estadoCalculado;

    // Relaciones opcionales a ítems
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_evento_id")
    private ItemEvento itemEvento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pool_asignacion_id")
    private AsignacionPool asignacionPool;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id")
    private ServicioPeriodo servicio;
}
