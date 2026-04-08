package com.festival.infrastructure.web.controller;

import com.festival.application.dto.servicioperiodo.ServicioPeriodoRequestDTO;
import com.festival.application.dto.servicioperiodo.ServicioPeriodoResponseDTO;
import com.festival.application.usecase.servicioperiodo.ServicioPeriodoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios-periodo")
@RequiredArgsConstructor
@Tag(name = "Servicios por Periodo", description = "Endpoints para la gestión de Servicios por Periodo de tiempo")
public class ServicioPeriodoController {

    private final ServicioPeriodoUseCase servicioPeriodoUseCase;

    @PostMapping
    @Operation(summary = "Crear Servicio por Periodo", description = "Registra un nuevo servicio en un periodo determinado.")
    public ResponseEntity<ServicioPeriodoResponseDTO> crearServicioPeriodo(@Valid @RequestBody ServicioPeriodoRequestDTO requestDTO) {
        ServicioPeriodoResponseDTO response = servicioPeriodoUseCase.crearServicioPeriodo(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Servicio por Periodo", description = "Actualiza los datos de un servicio existente.")
    public ResponseEntity<ServicioPeriodoResponseDTO> actualizarServicioPeriodo(@PathVariable Long id, @Valid @RequestBody ServicioPeriodoRequestDTO requestDTO) {
        return ResponseEntity.ok(servicioPeriodoUseCase.actualizarServicioPeriodo(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Servicio", description = "Obtiene los detalles de un servicio por su ID.")
    public ResponseEntity<ServicioPeriodoResponseDTO> obtenerServicioPeriodo(@PathVariable Long id) {
        return ResponseEntity.ok(servicioPeriodoUseCase.obtenerServicioPeriodo(id));
    }

    @GetMapping
    @Operation(summary = "Listar Servicios", description = "Obtiene la lista de todos los servicios registrados.")
    public ResponseEntity<List<ServicioPeriodoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(servicioPeriodoUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Servicios por Festival", description = "Obtiene los servicios pertenecientes a un festival específico.")
    public ResponseEntity<List<ServicioPeriodoResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(servicioPeriodoUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Servicio", description = "Elimina un servicio por su ID.")
    public ResponseEntity<Void> eliminarServicioPeriodo(@PathVariable Long id) {
        servicioPeriodoUseCase.eliminarServicioPeriodo(id);
        return ResponseEntity.noContent().build();
    }
}
