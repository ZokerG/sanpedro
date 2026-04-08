package com.festival.infrastructure.web.controller;

import com.festival.application.dto.tareapadre.TareaPadreRequestDTO;
import com.festival.application.dto.tareapadre.TareaPadreResponseDTO;
import com.festival.application.usecase.tareapadre.TareaPadreUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas-padre")
@RequiredArgsConstructor
@Tag(name = "Tareas Padre", description = "Endpoints para la gestión de las Tareas Principales de Eventos")
public class TareaPadreController {

    private final TareaPadreUseCase tareaPadreUseCase;

    @PostMapping
    @Operation(summary = "Crear Tarea Padre", description = "Crea una nueva tarea principal dentro de un evento.")
    public ResponseEntity<TareaPadreResponseDTO> crearTareaPadre(@Valid @RequestBody TareaPadreRequestDTO requestDTO) {
        TareaPadreResponseDTO response = tareaPadreUseCase.crearTareaPadre(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Tarea Padre", description = "Actualiza los detalles de una tarea principal existente.")
    public ResponseEntity<TareaPadreResponseDTO> actualizarTareaPadre(@PathVariable Long id, @Valid @RequestBody TareaPadreRequestDTO requestDTO) {
        return ResponseEntity.ok(tareaPadreUseCase.actualizarTareaPadre(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Tarea", description = "Obtiene los detalles de una tarea principal por su ID.")
    public ResponseEntity<TareaPadreResponseDTO> obtenerTareaPadre(@PathVariable Long id) {
        return ResponseEntity.ok(tareaPadreUseCase.obtenerTareaPadre(id));
    }

    @GetMapping
    @Operation(summary = "Listar Tareas", description = "Obtiene la lista de todas las tareas principales registradas.")
    public ResponseEntity<List<TareaPadreResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(tareaPadreUseCase.obtenerTodos());
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar Tareas por Evento", description = "Obtiene las tareas principales asociadas a un evento en particular.")
    public ResponseEntity<List<TareaPadreResponseDTO>> obtenerPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(tareaPadreUseCase.obtenerPorEvento(eventoId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Tarea", description = "Elimina una tarea principal por su ID.")
    public ResponseEntity<Void> eliminarTareaPadre(@PathVariable Long id) {
        tareaPadreUseCase.eliminarTareaPadre(id);
        return ResponseEntity.noContent().build();
    }
}
