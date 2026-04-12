package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entidad central de Personal.
 * Incluye datos de identidad, datos de contacto, datos bancarios,
 * clasificación por TipoPersonal y Cargo (Rol), y vínculo 1:1 con Usuario.
 */
@Entity
@Table(name = "personal")
@Getter
@Setter
@NoArgsConstructor
public class Personal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─── Datos de Identidad ───────────────────────────────
    @Column(name = "primer_nombre", nullable = false, length = 100)
    private String primerNombre;

    @Column(name = "segundo_nombre", length = 100)
    private String segundoNombre;

    @Column(name = "primer_apellido", nullable = false, length = 100)
    private String primerApellido;

    @Column(name = "segundo_apellido", length = 100)
    private String segundoApellido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false, length = 50)
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", nullable = false, unique = true, length = 50)
    private String numeroDocumento;

    // ─── Datos de Contacto ────────────────────────────────
    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "direccion", length = 255)
    private String direccion;

    /**
     * Nombre de la ARL (Administradora de Riesgos Laborales) a la que está afiliado.
     * Aplica para todo tipo de personal (logístico, administrativo, prensa).
     */
    @Column(name = "arl", length = 150)
    private String arl;

    // ─── Datos Bancarios ──────────────────────────────────
    /**
     * Banco donde el personal tiene su cuenta. Relación con tabla bancos.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banco_id")
    private Banco banco;

    /**
     * Tipo de cuenta bancaria. Relación con tabla tipos_cuenta_bancaria.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_cuenta_bancaria_id")
    private TipoCuentaBancaria tipoCuentaBancaria;

    @Column(name = "numero_cuenta", length = 50)
    private String numeroCuenta;

    // ─── Clasificación Organizacional ─────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_personal", nullable = false, length = 50)
    private TipoPersonal tipoPersonal;

    /**
     * Cargo dentro del sector (dinámico, manejado con la tabla de roles).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cargo_id")
    private Rol cargo;

    // ─── Acreditación y Control ───────────────────────────
    @Column(name = "numero_camiseta", unique = true)
    private Integer numeroCamiseta;

    @Column(name = "codigo_qr", unique = true, length = 200)
    private String codigoQr;

    /**
     * El estado activo se calcula en base a si tiene todos los documentos mínimos verificados.
     * No se almacena en DB, se computa en el DTO.
     */
    @Transient
    private boolean activo;

    /**
     * Credenciales de acceso al sistema (relación 1:1).
     */
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "usuario_id", unique = true)
    private Usuario usuario;

    // ─── Helpers ──────────────────────────────────────────
    public String getNombreCompleto() {
        String sn = (segundoNombre != null && !segundoNombre.isBlank()) ? " " + segundoNombre : "";
        String sa = (segundoApellido != null && !segundoApellido.isBlank()) ? " " + segundoApellido : "";
        return primerNombre + sn + " " + primerApellido + sa;
    }
}
