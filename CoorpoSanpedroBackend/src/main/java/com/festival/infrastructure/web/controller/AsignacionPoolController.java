package com.festival.infrastructure.web.controller;

import com.festival.application.dto.asignacionpool.AsignacionPoolRequestDTO;
import com.festival.application.dto.asignacionpool.AsignacionPoolResponseDTO;
import com.festival.application.usecase.asignacionpool.AsignacionPoolUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones-pool")
@RequiredArgsConstructor
@Tag(name = "Asignaciones de Pool", description = "Endpoints para la gestión de las asignaciones de Pool a Eventos")
public class AsignacionPoolController {

    private final AsignacionPoolUseCase asignacionUseCase;

    @PostMapping
    @Operation(summary = "Crear Asignación", description = "Registra una nueva asignación de un pool transversal a un evento.")
    public ResponseEntity<AsignacionPoolResponseDTO> crearAsignacion(@Valid @RequestBody AsignacionPoolRequestDTO requestDTO) {
        AsignacionPoolResponseDTO response = asignacionUseCase.crearAsignacion(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Asignación", description = "Actualiza los detalles de una asignación existente.")
    public ResponseEntity<AsignacionPoolResponseDTO> actualizarAsignacion(@PathVariable Long id, @Valid @RequestBody AsignacionPoolRequestDTO requestDTO) {
        return ResponseEntity.ok(asignacionUseCase.actualizarAsignacion(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Asignación", description = "Obtiene los detalles de una asignación por su ID.")
    public ResponseEntity<AsignacionPoolResponseDTO> obtenerAsignacion(@PathVariable Long id) {
        return ResponseEntity.ok(asignacionUseCase.obtenerAsignacion(id));
    }

    @GetMapping
    @Operation(summary = "Listar Asignaciones", description = "Obtiene la lista de todas las asignaciones registradas.")
    public ResponseEntity<List<AsignacionPoolResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(asignacionUseCase.obtenerTodos());
    }

    @GetMapping("/pool/{poolId}")
    @Operation(summary = "Listar Asignaciones por Pool", description = "Obtiene las asignaciones relacionadas con un pool transversal específico.")
    public ResponseEntity<List<AsignacionPoolResponseDTO>> obtenerPorPool(@PathVariable Long poolId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorPool(poolId));
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar Asignaciones por Evento", description = "Obtiene las asignaciones relacionadas con un evento específico.")
    public ResponseEntity<List<AsignacionPoolResponseDTO>> obtenerPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorEvento(eventoId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Asignación", description = "Elimina una asignación por su ID.")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long id) {
        asignacionUseCase.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }
}
