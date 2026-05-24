package com.festival.infrastructure.web.controller;

import com.festival.application.dto.jornada.*;
import com.festival.application.usecase.jornada.JornadaUseCase;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jornadas")
@RequiredArgsConstructor
@Tag(name = "Jornadas", description = "Control de jornada laboral: inicio, estado, ubicación GPS")
public class JornadaController {

    private final JornadaUseCase jornadaUseCase;
    private final PersonalRepository personalRepository;

    @PostMapping("/iniciar")
    @Operation(summary = "Iniciar jornada laboral")
    public ResponseEntity<JornadaResponseDTO> iniciar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody IniciarJornadaRequestDTO dto) {
        Long personalId = obtenerPersonalId(usuario);
        return ResponseEntity.ok(jornadaUseCase.iniciarJornada(personalId, dto));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de jornada (ACTIVO, EN_RUTA, PAUSA, FIN_JORNADA)")
    public ResponseEntity<JornadaResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoRequestDTO dto) {
        return ResponseEntity.ok(jornadaUseCase.cambiarEstado(id, dto));
    }

    @PostMapping("/{id}/ubicacion")
    @Operation(summary = "Reportar ubicación GPS durante la jornada")
    public ResponseEntity<UbicacionResponseDTO> reportarUbicacion(
            @PathVariable Long id,
            @Valid @RequestBody UbicacionRequestDTO dto) {
        return ResponseEntity.ok(jornadaUseCase.reportarUbicacion(id, dto));
    }

    @GetMapping("/activa")
    @Operation(summary = "Obtener la jornada activa del usuario autenticado")
    public ResponseEntity<JornadaResponseDTO> obtenerActiva(
            @AuthenticationPrincipal Usuario usuario) {
        Long personalId = obtenerPersonalId(usuario);
        return ResponseEntity.ok(jornadaUseCase.obtenerJornadaActiva(personalId));
    }

    @GetMapping("/activas")
    @Operation(summary = "Listar todas las jornadas activas (admin/líder)")
    public ResponseEntity<List<JornadaResponseDTO>> listarActivas() {
        return ResponseEntity.ok(jornadaUseCase.obtenerJornadasActivas());
    }

    private Long obtenerPersonalId(Usuario usuario) {
        return personalRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró perfil de personal para el usuario: " + usuario.getEmail()))
                .getId();
    }
}
