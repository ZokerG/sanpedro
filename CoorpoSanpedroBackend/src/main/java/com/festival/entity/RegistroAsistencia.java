package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Registro de cada escaneo QR realizado por la app de control de asistencia.
 * INGRESO: primera entrada del logístico al evento → marca asistio = true en AsignacionPersonal.
 * SALIDA: registro de salida (informativo).
 */
@Entity
@Table(name = "registros_asistencia")
@Getter
@Setter
@NoArgsConstructor
public class RegistroAsistencia extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignacion_id", nullable = false)
    private AsignacionPersonal asignacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 20)
    private TipoRegistroAsistencia tipo;

    @Column(name = "timestamp_registro", nullable = false)
    private LocalDateTime timestampRegistro;

    /**
     * Usuario del sistema que realizó el escaneo (operador de la app escáner).
     */
    @Column(name = "registrado_por", length = 150)
    private String registradoPor;
}
