package com.festival.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

public record AuthRequestDTO(
        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "El formato de correo no es válido")
        String correo,
        
        @NotBlank(message = "La contraseña es obligatoria")
        String contrasena
) {}
