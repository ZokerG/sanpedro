package com.festival.application.usecase.usuario;

import com.festival.application.dto.usuario.UsuarioRequestDTO;
import com.festival.application.dto.usuario.UsuarioResponseDTO;
import com.festival.entity.Rol;

import java.util.List;

public interface UsuarioUseCase {
    UsuarioResponseDTO crearUsuario(UsuarioRequestDTO requestDTO);

    List<UsuarioResponseDTO> listarPorRol(Rol rol);
}
