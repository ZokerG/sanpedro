package com.festival.infrastructure.web.controller;

import com.festival.application.dto.sector.SectorRequestDTO;
import com.festival.application.dto.sector.SectorResponseDTO;
import com.festival.application.usecase.sector.SectorUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectores")
@RequiredArgsConstructor
@Tag(name = "Sectores", description = "Endpoints para la gestión de Sectores dentro de un Festival")
public class SectorController {

    private final SectorUseCase sectorUseCase;

    @PostMapping
    @Operation(summary = "Crear Sector", description = "Registra un nuevo sector asociado a un festival.")
    public ResponseEntity<SectorResponseDTO> crearSector(@Valid @RequestBody SectorRequestDTO requestDTO) {
        SectorResponseDTO response = sectorUseCase.crearSector(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Sector", description = "Actualiza los datos de un sector existente.")
    public ResponseEntity<SectorResponseDTO> actualizarSector(@PathVariable Long id, @Valid @RequestBody SectorRequestDTO requestDTO) {
        return ResponseEntity.ok(sectorUseCase.actualizarSector(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Sector", description = "Obtiene los detalles de un sector por su ID.")
    public ResponseEntity<SectorResponseDTO> obtenerSector(@PathVariable Long id) {
        return ResponseEntity.ok(sectorUseCase.obtenerSector(id));
    }

    @GetMapping
    @Operation(summary = "Listar Sectores", description = "Obtiene la lista de todos los sectores.")
    public ResponseEntity<List<SectorResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(sectorUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Sectores por Festival", description = "Obtiene los sectores que pertenecen a un festival específico.")
    public ResponseEntity<List<SectorResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(sectorUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Sector", description = "Elimina un sector por su ID.")
    public ResponseEntity<Void> eliminarSector(@PathVariable Long id) {
        sectorUseCase.eliminarSector(id);
        return ResponseEntity.noContent().build();
    }
}
