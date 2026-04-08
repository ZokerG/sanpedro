package com.festival.application.dto.usuario;

import com.festival.entity.Rol;
import lombok.Builder;

@Builder
public record UsuarioResponseDTO(
    Long id,
    String nombre,
    String apellido,
    String email,
    Rol rol,
    boolean activo
) {}
