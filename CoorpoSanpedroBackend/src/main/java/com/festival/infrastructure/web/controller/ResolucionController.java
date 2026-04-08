package com.festival.infrastructure.web.controller;

import com.festival.application.dto.resolucion.ResolucionRequestDTO;
import com.festival.application.dto.resolucion.ResolucionResponseDTO;
import com.festival.application.usecase.resolucion.ResolucionUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resoluciones")
@RequiredArgsConstructor
@Tag(name = "Resoluciones", description = "Endpoints para la gestión de Resoluciones")
public class ResolucionController {

    private final ResolucionUseCase resolucionUseCase;

    @PostMapping
    @Operation(summary = "Crear Resolución", description = "Crea una nueva resolución asociada a un festival.")
    public ResponseEntity<ResolucionResponseDTO> crearResolucion(@Valid @RequestBody ResolucionRequestDTO requestDTO) {
        ResolucionResponseDTO response = resolucionUseCase.crearResolucion(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Resolución", description = "Actualiza los datos de una resolución existente.")
    public ResponseEntity<ResolucionResponseDTO> actualizarResolucion(@PathVariable Long id, @Valid @RequestBody ResolucionRequestDTO requestDTO) {
        return ResponseEntity.ok(resolucionUseCase.actualizarResolucion(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Resolución", description = "Obtiene los detalles de una resolución por su ID.")
    public ResponseEntity<ResolucionResponseDTO> obtenerResolucion(@PathVariable Long id) {
        return ResponseEntity.ok(resolucionUseCase.obtenerResolucion(id));
    }

    @GetMapping
    @Operation(summary = "Listar Resoluciones", description = "Obtiene la lista de todas las resoluciones.")
    public ResponseEntity<List<ResolucionResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(resolucionUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Resoluciones por Festival", description = "Obtiene las resoluciones que pertenecen a un festival.")
    public ResponseEntity<List<ResolucionResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(resolucionUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Resolución", description = "Elimina una resolución por su ID.")
    public ResponseEntity<Void> eliminarResolucion(@PathVariable Long id) {
        resolucionUseCase.eliminarResolucion(id);
        return ResponseEntity.noContent().build();
    }
}
