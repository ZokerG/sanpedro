package com.festival.infrastructure.web.controller;

import com.festival.application.dto.banco.BancoDTO;
import com.festival.application.dto.banco.BancoRequestDTO;
import com.festival.application.usecase.banco.BancoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bancos")
@RequiredArgsConstructor
@Tag(name = "Bancos", description = "Gestión de entidades bancarias")
public class BancoController {

    private final BancoUseCase bancoUseCase;

    @GetMapping
    @Operation(summary = "Listar bancos", description = "Si ?activo=true solo retorna activos")
    public ResponseEntity<List<BancoDTO>> getAllBancos(@RequestParam(required = false, defaultValue = "false") boolean activo) {
        if (activo) {
            return ResponseEntity.ok(bancoUseCase.obtenerActivos());
        }
        return ResponseEntity.ok(bancoUseCase.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BancoDTO> getBancoById(@PathVariable Long id) {
        return ResponseEntity.ok(bancoUseCase.obtenerBanco(id));
    }

    @PostMapping
    @Operation(summary = "Crear banco")
    public ResponseEntity<BancoDTO> createBanco(@Valid @RequestBody BancoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bancoUseCase.crearBanco(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar banco")
    public ResponseEntity<BancoDTO> updateBanco(@PathVariable Long id, @Valid @RequestBody BancoRequestDTO requestDTO) {
        return ResponseEntity.ok(bancoUseCase.actualizarBanco(id, requestDTO));
    }

    @PatchMapping("/{id}/toggle-activo")
    @Operation(summary = "Activar/desactivar banco")
    public ResponseEntity<Void> toggleActivo(@PathVariable Long id) {
        bancoUseCase.toggleActivo(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar banco")
    public ResponseEntity<Void> deleteBanco(@PathVariable Long id) {
        bancoUseCase.eliminarBanco(id);
        return ResponseEntity.noContent().build();
    }
}
