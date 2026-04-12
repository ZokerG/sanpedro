package com.festival.application.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AppOtpRequestDTO(
        @NotBlank(message = "El correo de contacto es obligatorio")
        @Email(message = "El formato de correo no es válido")
        String email,

        @NotBlank(message = "El código OTP es obligatorio")
        @Size(min = 6, max = 6, message = "El código OTP debe tener 6 dígitos")
        String otp
) {}
