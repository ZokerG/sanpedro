package com.festival.infrastructure.web.controller;

import com.festival.application.dto.novedad.NovedadRequestDTO;
import com.festival.application.dto.novedad.NovedadResponseDTO;
import com.festival.application.usecase.novedad.NovedadUseCase;
import com.festival.entity.EntidadNovedad;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/novedades")
@RequiredArgsConstructor
@Tag(name = "Novedades", description = "Endpoints para la gestión de novedades y observaciones")
public class NovedadController {

    private final NovedadUseCase novedadUseCase;

    @PostMapping
    @Operation(summary = "Crear Novedad", description = "Registra una nueva novedad u observación relacionada con cualquier entidad.")
    public ResponseEntity<NovedadResponseDTO> crearNovedad(@Valid @RequestBody NovedadRequestDTO requestDTO) {
        NovedadResponseDTO response = novedadUseCase.crearNovedad(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Novedad", description = "Actualiza los detalles de una novedad existente.")
    public ResponseEntity<NovedadResponseDTO> actualizarNovedad(@PathVariable Long id, @Valid @RequestBody NovedadRequestDTO requestDTO) {
        return ResponseEntity.ok(novedadUseCase.actualizarNovedad(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Novedad", description = "Obtiene los detalles de una novedad por su ID.")
    public ResponseEntity<NovedadResponseDTO> obtenerNovedad(@PathVariable Long id) {
        return ResponseEntity.ok(novedadUseCase.obtenerNovedad(id));
    }

    @GetMapping
    @Operation(summary = "Listar Novedades", description = "Obtiene la lista de todas las novedades registradas.")
    public ResponseEntity<List<NovedadResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(novedadUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Novedades por Festival", description = "Obtiene las novedades pertenecientes a un festival específico.")
    public ResponseEntity<List<NovedadResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(novedadUseCase.obtenerPorFestival(festivalId));
    }

    @GetMapping("/entidad/{tipoEntidad}/{entidadId}")
    @Operation(summary = "Listar Novedades por Entidad", description = "Obtiene las novedades filtradas por su tipo de entidad y su ID correspondiente.")
    public ResponseEntity<List<NovedadResponseDTO>> obtenerPorEntidad(@PathVariable EntidadNovedad tipoEntidad, @PathVariable Long entidadId) {
        return ResponseEntity.ok(novedadUseCase.obtenerPorEntidad(tipoEntidad, entidadId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Novedad", description = "Elimina una novedad por su ID.")
    public ResponseEntity<Void> eliminarNovedad(@PathVariable Long id) {
        novedadUseCase.eliminarNovedad(id);
        return ResponseEntity.noContent().build();
    }
}
