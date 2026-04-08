package com.festival.infrastructure.web.controller;

import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalRequestDTO;
import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalResponseDTO;
import com.festival.application.usecase.trasladopresupuestal.TrasladoPresupuestalUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traslados-presupuestales")
@RequiredArgsConstructor
@Tag(name = "Traslados Presupuestales", description = "Endpoints para la gestión de Traslados Presupuestales")
public class TrasladoPresupuestalController {

    private final TrasladoPresupuestalUseCase trasladoUseCase;

    @PostMapping
    @Operation(summary = "Crear Traslado Presupuestal", description = "Crea un nuevo traslado presupuestal.")
    public ResponseEntity<TrasladoPresupuestalResponseDTO> crearTraslado(@Valid @RequestBody TrasladoPresupuestalRequestDTO requestDTO) {
        TrasladoPresupuestalResponseDTO response = trasladoUseCase.crearTraslado(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Traslado Presupuestal", description = "Actualiza los datos de un traslado existente.")
    public ResponseEntity<TrasladoPresupuestalResponseDTO> actualizarTraslado(@PathVariable Long id, @Valid @RequestBody TrasladoPresupuestalRequestDTO requestDTO) {
        return ResponseEntity.ok(trasladoUseCase.actualizarTraslado(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Traslado", description = "Obtiene los detalles de un traslado presupuestal por su ID.")
    public ResponseEntity<TrasladoPresupuestalResponseDTO> obtenerTraslado(@PathVariable Long id) {
        return ResponseEntity.ok(trasladoUseCase.obtenerTraslado(id));
    }

    @GetMapping
    @Operation(summary = "Listar Traslados", description = "Obtiene la lista de todos los traslados presupuestales.")
    public ResponseEntity<List<TrasladoPresupuestalResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(trasladoUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Traslados por Festival", description = "Obtiene los traslados presupuestales de un festival específico.")
    public ResponseEntity<List<TrasladoPresupuestalResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(trasladoUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Traslado", description = "Elimina un traslado presupuestal por su ID.")
    public ResponseEntity<Void> eliminarTraslado(@PathVariable Long id) {
        trasladoUseCase.eliminarTraslado(id);
        return ResponseEntity.noContent().build();
    }
}
