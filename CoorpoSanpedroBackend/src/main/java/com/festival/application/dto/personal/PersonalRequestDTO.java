package com.festival.application.dto.personal;

import com.festival.entity.TipoDocumento;
import com.festival.entity.TipoPersonal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonalRequestDTO {

    // ─── Identidad (obligatorio) ──────────────────────────────
    @NotBlank(message = "El primer nombre es obligatorio")
    private String primerNombre;

    private String segundoNombre;

    @NotBlank(message = "El primer apellido es obligatorio")
    private String primerApellido;

    private String segundoApellido;

    @NotNull(message = "El tipo de documento es obligatorio")
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    private String numeroDocumento;

    // ─── Contacto (obligatorio) ───────────────────────────────
    @NotBlank(message = "El correo electrónico es obligatorio")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotBlank(message = "La ARL es obligatoria")
    private String arl;

    // ─── Datos bancarios (obligatorio) ────────────────────────
    @NotNull(message = "El banco es obligatorio")
    private Long bancoId;

    @NotNull(message = "El tipo de cuenta bancaria es obligatorio")
    private Long tipoCuentaBancariaId;

    @NotBlank(message = "El número de cuenta es obligatorio")
    private String numeroCuenta;

    // ─── Clasificación (obligatorio) ──────────────────────────
    @NotNull(message = "El tipo de personal es obligatorio")
    private TipoPersonal tipoPersonal;

    @NotNull(message = "El cargo (rol) es obligatorio")
    private Long cargoId;

    // ─── Acreditación (obligatorio solo para LOGÍSTICO) ───────
    private Integer numeroCamiseta;
}
