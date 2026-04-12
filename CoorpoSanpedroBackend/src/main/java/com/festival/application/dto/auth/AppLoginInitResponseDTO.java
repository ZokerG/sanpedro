package com.festival.application.dto.auth;

public record AppLoginInitResponseDTO(
        String message,
        String emailMasked
) {}
