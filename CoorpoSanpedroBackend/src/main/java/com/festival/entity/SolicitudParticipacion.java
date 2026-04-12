package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Solicitud de un personal logístico para participar en un evento.
 * El personal solicita participar y el administrador aprueba o rechaza.
 */
@Entity
@Table(name = "solicitudes_participacion")
@Getter
@Setter
@NoArgsConstructor
public class SolicitudParticipacion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Personal logístico que solicita participar */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    /** Evento al que solicita participar */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    /** Estado de la solicitud */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoSolicitud estado = EstadoSolicitud.PENDIENTE;

    /** Fecha y hora de la solicitud */
    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    /** Fecha de resolución (aprobación o rechazo) */
    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    /** Nota o motivo del rechazo */
    @Column(name = "nota_rechazo", columnDefinition = "TEXT")
    private String notaRechazo;

    /** Rol o puesto que desea desempeñar en el evento */
    @Column(name = "rol_asignado", length = 150)
    private String rolAsignado;

    /** Asignación creada si fue aprobada */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignacion_id")
    private AsignacionPersonal asignacion;
}
