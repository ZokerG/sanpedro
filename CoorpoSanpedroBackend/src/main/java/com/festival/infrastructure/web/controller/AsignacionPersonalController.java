package com.festival.infrastructure.web.controller;

import com.festival.application.dto.asignacionpersonal.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacionpersonal.AsignacionPersonalResponseDTO;
import com.festival.application.usecase.asignacionpersonal.AsignacionPersonalUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones-personal")
@RequiredArgsConstructor
@Tag(name = "Asignaciones de Personal Logístico", description = "Endpoints para la gestión de asignaciones de personal logístico a eventos")
public class AsignacionPersonalController {

    private final AsignacionPersonalUseCase asignacionUseCase;

    @PostMapping
    @Operation(summary = "Crear Asignación", description = "Registra una nueva asignación de personal logístico a un evento.")
    public ResponseEntity<AsignacionPersonalResponseDTO> crearAsignacion(
            @Valid @RequestBody AsignacionPersonalRequestDTO requestDTO) {
        AsignacionPersonalResponseDTO response = asignacionUseCase.crearAsignacion(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/masiva")
    @Operation(summary = "Asignación Masiva Aleatoria", description = "Asigna N cantidad de personal de logística aleatoriamente a un evento.")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> asignacionMasiva(
            @RequestParam Long eventoId,
            @RequestParam int cantidad,
            @RequestParam(required = false) List<Long> excluirIds) {
        List<AsignacionPersonalResponseDTO> responses = asignacionUseCase.asignacionMasiva(eventoId, cantidad, excluirIds);
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Asignación", description = "Actualiza los detalles de una asignación existente.")
    public ResponseEntity<AsignacionPersonalResponseDTO> actualizarAsignacion(
            @PathVariable Long id,
            @Valid @RequestBody AsignacionPersonalRequestDTO requestDTO) {
        return ResponseEntity.ok(asignacionUseCase.actualizarAsignacion(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Asignación", description = "Obtiene los detalles de una asignación por su ID.")
    public ResponseEntity<AsignacionPersonalResponseDTO> obtenerAsignacion(@PathVariable Long id) {
        return ResponseEntity.ok(asignacionUseCase.obtenerAsignacion(id));
    }

    @GetMapping
    @Operation(summary = "Listar Asignaciones", description = "Obtiene la lista de todas las asignaciones registradas.")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(asignacionUseCase.obtenerTodos());
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar Asignaciones por Evento", description = "Obtiene las asignaciones de personal relacionadas con un evento específico.")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> obtenerPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorEvento(eventoId));
    }

    @GetMapping("/personal/{personalId}")
    @Operation(summary = "Listar Asignaciones por Personal", description = "Obtiene las asignaciones de un miembro de personal específico.")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> obtenerPorPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorPersonal(personalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Asignación", description = "Elimina físicamente una asignación por su ID.")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long id) {
        asignacionUseCase.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar Asignación", description = "Desactiva una asignación (soft delete) sin eliminarla de la base de datos.")
    public ResponseEntity<Void> desactivarAsignacion(@PathVariable Long id) {
        asignacionUseCase.desactivarAsignacion(id);
        return ResponseEntity.noContent().build();
    }
}
