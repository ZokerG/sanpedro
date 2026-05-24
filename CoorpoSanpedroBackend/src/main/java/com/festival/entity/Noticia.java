package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "noticias")
@Getter
@Setter
@NoArgsConstructor
public class Noticia extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @Column(nullable = false, length = 300)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(length = 100)
    private String planta;

    @Column(nullable = false)
    private boolean destacada = false;

    @Column(name = "imagen_ruta")
    private String imagenRuta;

    @Column(name = "fecha_publicacion", nullable = false)
    private String fechaPublicacion;
}
