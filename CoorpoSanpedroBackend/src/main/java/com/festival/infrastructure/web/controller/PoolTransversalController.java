package com.festival.infrastructure.web.controller;

import com.festival.application.dto.pooltransversal.PoolTransversalRequestDTO;
import com.festival.application.dto.pooltransversal.PoolTransversalResponseDTO;
import com.festival.application.usecase.pooltransversal.PoolTransversalUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pools-transversales")
@RequiredArgsConstructor
@Tag(name = "Pool Transversal", description = "Endpoints para la gestión de Pools Transversales (Elementos compartidos)")
public class PoolTransversalController {

    private final PoolTransversalUseCase poolUseCase;

    @PostMapping
    @Operation(summary = "Crear Pool Transversal", description = "Registra un nuevo elemento transversal de presupuesto.")
    public ResponseEntity<PoolTransversalResponseDTO> crearPool(@Valid @RequestBody PoolTransversalRequestDTO requestDTO) {
        PoolTransversalResponseDTO response = poolUseCase.crearPool(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Pool Transversal", description = "Actualiza los datos de un pool existente.")
    public ResponseEntity<PoolTransversalResponseDTO> actualizarPool(@PathVariable Long id, @Valid @RequestBody PoolTransversalRequestDTO requestDTO) {
        return ResponseEntity.ok(poolUseCase.actualizarPool(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Pool", description = "Obtiene los detalles de un pool transversal por su ID.")
    public ResponseEntity<PoolTransversalResponseDTO> obtenerPool(@PathVariable Long id) {
        return ResponseEntity.ok(poolUseCase.obtenerPool(id));
    }

    @GetMapping
    @Operation(summary = "Listar Pools Transversales", description = "Obtiene la lista de todos los pools transversales.")
    public ResponseEntity<List<PoolTransversalResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(poolUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Pools por Festival", description = "Obtiene los pools transversales de un festival específico.")
    public ResponseEntity<List<PoolTransversalResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(poolUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Pool", description = "Elimina un pool transversal por su ID.")
    public ResponseEntity<Void> eliminarPool(@PathVariable Long id) {
        poolUseCase.eliminarPool(id);
        return ResponseEntity.noContent().build();
    }
}
