package com.festival.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AppLoginRequestDTO(
        @NotBlank(message = "El correo de contacto es obligatorio")
        @Email(message = "El formato de correo no es válido")
        String email,

        @NotBlank(message = "El número de documento es obligatorio")
        String documento
) {}
