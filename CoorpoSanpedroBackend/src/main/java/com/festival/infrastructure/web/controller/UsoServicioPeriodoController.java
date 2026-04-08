package com.festival.infrastructure.web.controller;

import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoRequestDTO;
import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoResponseDTO;
import com.festival.application.usecase.usoservicioperiodo.UsoServicioPeriodoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usos-servicio")
@RequiredArgsConstructor
@Tag(name = "Uso de Servicios", description = "Endpoints para la gestión del consumo y uso de servicios por periodo")
public class UsoServicioPeriodoController {

    private final UsoServicioPeriodoUseCase usoUseCase;

    @PostMapping
    @Operation(summary = "Crear Uso de Servicio", description = "Registra un nuevo uso o consumo de un servicio para un evento.")
    public ResponseEntity<UsoServicioPeriodoResponseDTO> crearUso(@Valid @RequestBody UsoServicioPeriodoRequestDTO requestDTO) {
        UsoServicioPeriodoResponseDTO response = usoUseCase.crearUso(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Uso de Servicio", description = "Actualiza los detalles de un registro de uso de servicio existente.")
    public ResponseEntity<UsoServicioPeriodoResponseDTO> actualizarUso(@PathVariable Long id, @Valid @RequestBody UsoServicioPeriodoRequestDTO requestDTO) {
        return ResponseEntity.ok(usoUseCase.actualizarUso(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Uso", description = "Obtiene los detalles de un uso de servicio por su ID.")
    public ResponseEntity<UsoServicioPeriodoResponseDTO> obtenerUso(@PathVariable Long id) {
        return ResponseEntity.ok(usoUseCase.obtenerUso(id));
    }

    @GetMapping
    @Operation(summary = "Listar Usos", description = "Obtiene la lista de todos los usos de servicio registrados.")
    public ResponseEntity<List<UsoServicioPeriodoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(usoUseCase.obtenerTodos());
    }

    @GetMapping("/servicio/{servicioId}")
    @Operation(summary = "Listar Usos por Servicio", description = "Obtiene los consumos relacionados con un servicio específico.")
    public ResponseEntity<List<UsoServicioPeriodoResponseDTO>> obtenerPorServicio(@PathVariable Long servicioId) {
        return ResponseEntity.ok(usoUseCase.obtenerPorServicio(servicioId));
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar Usos por Evento", description = "Obtiene los consumos relacionados con un evento específico.")
    public ResponseEntity<List<UsoServicioPeriodoResponseDTO>> obtenerPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(usoUseCase.obtenerPorEvento(eventoId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Uso", description = "Elimina un registro de uso de servicio por su ID.")
    public ResponseEntity<Void> eliminarUso(@PathVariable Long id) {
        usoUseCase.eliminarUso(id);
        return ResponseEntity.noContent().build();
    }
}
