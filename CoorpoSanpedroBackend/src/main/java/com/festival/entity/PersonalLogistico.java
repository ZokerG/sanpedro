package com.festival.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "personal_logistico")
@Getter
@Setter
@NoArgsConstructor
public class PersonalLogistico extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(name = "numero_camiseta", nullable = false, unique = true)
    private Integer numeroCamiseta;

    @Column(name = "codigo_qr", nullable = false, unique = true, length = 100)
    private String codigoQr;

    @Column(nullable = false)
    private boolean activo = true;
}
