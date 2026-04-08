package com.festival.application.dto.auth;

public record AuthResponseDTO(
        String token,
        String correo,
        String rol
) {}
