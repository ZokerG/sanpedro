package com.festival.application.dto.personal;

import com.festival.entity.TipoDocumento;
import com.festival.entity.TipoPersonal;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonalResponseDTO {
    private Long id;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String nombreCompleto;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;

    // Contacto
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String arl;

    // Datos bancarios
    private Long bancoId;
    private String bancoNombre;
    private Long tipoCuentaBancariaId;
    private String tipoCuentaBancariaNombre;
    private String numeroCuenta;

    // Clasificación
    private TipoPersonal tipoPersonal;
    private Long cargoId;
    private String cargoNombre;

    // Acreditación
    private Integer numeroCamiseta;
    private String codigoQr;

    /**
     * Estado activo = documentosCompletos.
     * Un personal solo puede trabajar si todos sus docs mínimos están VERIFICADOS.
     */
    private boolean activo;

    private boolean documentosCompletos;

    // Credenciales
    private String usuarioEmail;
}
