package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Asignación de un PersonalLogístico a un Evento específico.
 * Solo se permiten registros donde Personal.tipoPersonal == LOGISTICO.
 * La validación se realiza en la capa de servicio (PersonalService.validarEsLogistico).
 */
@Entity
@Table(name = "asignaciones_personal")
@Getter
@Setter
@NoArgsConstructor
public class AsignacionPersonal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(name = "rol_asignado", length = 100)
    private String rolAsignado;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDateTime fechaAsignacion;

    /**
     * Se marca en true cuando el personal escanea su QR al ingresar al evento.
     */
    @Column(name = "asistio", nullable = false)
    private boolean asistio = false;

    @Column(nullable = false)
    private boolean activo = true;
}
