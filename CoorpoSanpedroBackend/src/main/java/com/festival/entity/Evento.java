package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
public class Evento extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    /**
     * Fecha de fin calculada automáticamente a partir de fechaInicio + duración en horas.
     * Se persiste en DB para consultas eficientes.
     */
    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "presupuesto_aprobado", precision = 15, scale = 2)
    private BigDecimal presupuestoAprobado;

    @Column(name = "presupuesto_ejecutado", precision = 15, scale = 2)
    private BigDecimal presupuestoEjecutado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EstadoEvento estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Prioridad prioridad;

    // ─── Control Logístico ────────────────────────────────────────────────────

    @Column(name = "ubicacion_logistica", length = 300)
    private String ubicacionLogistica;

    @Column(name = "limite_personal")
    private Integer limitePersonal;

    @Column(name = "cuota_pago", precision = 12, scale = 2)
    private BigDecimal cuotaPago;

    // ─── Helpers ────────────────────────────────────────────────────────────

    /**
     * Establece fechaFin sumando horas a fechaInicio.
     * Si horas es null o <= 0, fechaFin se establece en null.
     */
    public void setDuracionHoras(Integer horas) {
        if (horas != null && horas > 0 && this.fechaInicio != null) {
            this.fechaFin = this.fechaInicio.plusHours(horas);
        } else {
            this.fechaFin = null;
        }
    }

    /**
     * Calcula la duración en horas desde fechaInicio hasta fechaFin.
     */
    public Integer getDuracionHoras() {
        if (this.fechaInicio != null && this.fechaFin != null) {
            return (int) Duration.between(this.fechaInicio, this.fechaFin).toHours();
        }
        return null;
    }
}
