package com.festival.application.dto.personal;

import com.festival.entity.TipoDocumento;
import com.festival.entity.TipoPersonal;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO completo de perfil para la app móvil.
 * Incluye foto de perfil en base64 y todos los datos visibles por el personal.
 * Solo se usa en GET /api/personal/{id}/perfil — no en listados.
 */
@Data
public class PerfilResponseDTO {

    private Long id;
    private String nombreCompleto;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;

    // Contacto
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String arl;

    // Laboral
    private TipoPersonal tipoPersonal;
    private String cargoNombre;
    private Integer numeroCamiseta;
    private String codigoQr;
    private boolean activo;

    // Bancario
    private String bancoNombre;
    private String tipoCuentaBancariaNombre;
    private String numeroCuenta;

    /**
     * Foto de perfil codificada en Base64 con prefijo data URI.
     * Ejemplo: "data:image/jpeg;base64,/9j/4AAQ..."
     * Null si no se ha subido foto.
     */
    private String fotoPerfil;
}
