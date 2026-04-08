package com.festival.infrastructure.web.controller;

import com.festival.application.dto.festival.FestivalRequestDTO;
import com.festival.application.dto.festival.FestivalResponseDTO;
import com.festival.application.usecase.festival.FestivalUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivales")
@RequiredArgsConstructor
@Tag(name = "Festivales", description = "Endpoints para la gestión de Festivales y sus ediciones")
public class FestivalController {

    private final FestivalUseCase festivalUseCase;

    @PostMapping
    @Operation(summary = "Crear Festival", description = "Registra una nueva edición del festival.")
    public ResponseEntity<FestivalResponseDTO> crearFestival(@Valid @RequestBody FestivalRequestDTO requestDTO) {
        FestivalResponseDTO response = festivalUseCase.crearFestival(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Festival", description = "Actualiza los datos de un festival existente.")
    public ResponseEntity<FestivalResponseDTO> actualizarFestival(@PathVariable Long id, @Valid @RequestBody FestivalRequestDTO requestDTO) {
        return ResponseEntity.ok(festivalUseCase.actualizarFestival(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Festival", description = "Obtiene los detalles de un festival por su ID.")
    public ResponseEntity<FestivalResponseDTO> obtenerFestival(@PathVariable Long id) {
        return ResponseEntity.ok(festivalUseCase.obtenerFestival(id));
    }

    @GetMapping
    @Operation(summary = "Listar Festivales", description = "Obtiene la lista de todos los festivales.")
    public ResponseEntity<List<FestivalResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(festivalUseCase.obtenerTodos());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Festival", description = "Elimina un festival por su ID.")
    public ResponseEntity<Void> eliminarFestival(@PathVariable Long id) {
        festivalUseCase.eliminarFestival(id);
        return ResponseEntity.noContent().build();
    }
}
