package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Catálogo de tipos de cuenta bancaria.
 * Reemplaza al enum TipoCuentaBancaria para permitir gestión dinámica.
 */
@Entity
@Table(name = "tipos_cuenta_bancaria")
@Getter
@Setter
@NoArgsConstructor
public class TipoCuentaBancaria extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private boolean activo = true;

    public TipoCuentaBancaria(String nombre) {
        this.nombre = nombre;
    }
}
