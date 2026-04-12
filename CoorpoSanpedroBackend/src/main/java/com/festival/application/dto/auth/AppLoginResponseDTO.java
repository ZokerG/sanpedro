package com.festival.application.dto.auth;

public record AppLoginResponseDTO(
        String token,
        Long personalId,
        String nombre,
        String correo,
        String rol,
        String codigoQr
) {}
