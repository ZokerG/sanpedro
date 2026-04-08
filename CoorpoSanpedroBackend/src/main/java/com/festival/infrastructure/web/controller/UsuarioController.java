package com.festival.infrastructure.web.controller;

import com.festival.application.dto.usuario.UsuarioRequestDTO;
import com.festival.application.dto.usuario.UsuarioResponseDTO;
import com.festival.application.usecase.usuario.UsuarioUseCase;
import com.festival.entity.Rol;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Endpoints para la gestión administrativa de usuarios (Requiere ser Director/Admin)")
public class UsuarioController {

    private final UsuarioUseCase usuarioUseCase;

    @PostMapping
    @Operation(summary = "Crear Nuevo Usuario", description = "Registra y asegura un nuevo usuario internamente válido según reglas del sistema.")
    public ResponseEntity<UsuarioResponseDTO> crearUsuario(@Valid @RequestBody UsuarioRequestDTO requestDTO) {
        UsuarioResponseDTO response = usuarioUseCase.crearUsuario(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar Usuarios por Rol", description = "Obtiene la lista de usuarios activos filtrada por rol.")
    public ResponseEntity<List<UsuarioResponseDTO>> listarPorRol(@RequestParam Rol rol) {
        return ResponseEntity.ok(usuarioUseCase.listarPorRol(rol));
    }
}
