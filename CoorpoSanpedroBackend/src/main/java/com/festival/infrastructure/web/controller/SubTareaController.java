package com.festival.infrastructure.web.controller;

import com.festival.application.dto.subtarea.SubTareaRequestDTO;
import com.festival.application.dto.subtarea.SubTareaResponseDTO;
import com.festival.application.usecase.subtarea.SubTareaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtareas")
@RequiredArgsConstructor
@Tag(name = "SubTareas", description = "Endpoints para la gestión de las subtareas operativas")
public class SubTareaController {

    private final SubTareaUseCase subTareaUseCase;

    @PostMapping
    @Operation(summary = "Crear SubTarea", description = "Crea una nueva subtarea asociada a una tarea padre.")
    public ResponseEntity<SubTareaResponseDTO> crearSubTarea(@Valid @RequestBody SubTareaRequestDTO requestDTO) {
        SubTareaResponseDTO response = subTareaUseCase.crearSubTarea(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar SubTarea", description = "Actualiza los detalles de una subtarea existente.")
    public ResponseEntity<SubTareaResponseDTO> actualizarSubTarea(@PathVariable Long id, @Valid @RequestBody SubTareaRequestDTO requestDTO) {
        return ResponseEntity.ok(subTareaUseCase.actualizarSubTarea(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar SubTarea", description = "Obtiene los detalles de una subtarea por su ID.")
    public ResponseEntity<SubTareaResponseDTO> obtenerSubTarea(@PathVariable Long id) {
        return ResponseEntity.ok(subTareaUseCase.obtenerSubTarea(id));
    }

    @GetMapping
    @Operation(summary = "Listar SubTareas", description = "Obtiene la lista de todas las subtareas registradas.")
    public ResponseEntity<List<SubTareaResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(subTareaUseCase.obtenerTodos());
    }

    @GetMapping("/tarea-padre/{tareaPadreId}")
    @Operation(summary = "Listar SubTareas por Tarea Padre", description = "Obtiene las subtareas asociadas a una tarea principal en particular.")
    public ResponseEntity<List<SubTareaResponseDTO>> obtenerPorTareaPadre(@PathVariable Long tareaPadreId) {
        return ResponseEntity.ok(subTareaUseCase.obtenerPorTareaPadre(tareaPadreId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar SubTarea", description = "Elimina una subtarea por su ID.")
    public ResponseEntity<Void> eliminarSubTarea(@PathVariable Long id) {
        subTareaUseCase.eliminarSubTarea(id);
        return ResponseEntity.noContent().build();
    }
}
