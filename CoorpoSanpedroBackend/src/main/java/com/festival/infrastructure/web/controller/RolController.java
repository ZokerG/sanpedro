package com.festival.infrastructure.web.controller;

import com.festival.application.dto.rol.RolDTO;
import com.festival.application.dto.rol.RolRequestDTO;
import com.festival.application.service.rol.RolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Gestión de roles y sectores del sistema")
public class RolController {

    private final RolService rolService;

    @GetMapping
    @Operation(summary = "Listar roles", description = "Si ?activo=true solo retorna activos")
    public ResponseEntity<List<RolDTO>> getAllRoles(@RequestParam(required = false, defaultValue = "false") boolean activo) {
        if (activo) {
            return ResponseEntity.ok(rolService.findAllActivos());
        }
        return ResponseEntity.ok(rolService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> getRolById(@PathVariable Long id) {
        return ResponseEntity.ok(rolService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crear rol")
    public ResponseEntity<RolDTO> createRol(@Valid @RequestBody RolRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rolService.create(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar rol")
    public ResponseEntity<RolDTO> updateRol(@PathVariable Long id, @Valid @RequestBody RolRequestDTO requestDTO) {
        return ResponseEntity.ok(rolService.update(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar rol (desactivación lógica)")
    public ResponseEntity<Void> deleteRol(@PathVariable Long id) {
        rolService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-activo")
    @Operation(summary = "Activar/desactivar rol")
    public ResponseEntity<Void> toggleActivo(@PathVariable Long id) {
        rolService.toggleActivo(id);
        return ResponseEntity.noContent().build();
    }
}
