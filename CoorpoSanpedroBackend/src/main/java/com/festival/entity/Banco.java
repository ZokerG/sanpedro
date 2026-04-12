package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Catálogo de entidades bancarias colombianas.
 * Reemplaza al enum TipoBanco para permitir gestión dinámica desde el sistema.
 */
@Entity
@Table(name = "bancos")
@Getter
@Setter
@NoArgsConstructor
public class Banco extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private boolean activo = true;

    public Banco(String nombre) {
        this.nombre = nombre;
    }
}
