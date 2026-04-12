package com.festival.infrastructure.web.controller;

import com.festival.application.dto.asignacion.AsignacionPersonalRequestDTO;
import com.festival.application.dto.asignacion.AsignacionPersonalResponseDTO;
import com.festival.application.dto.asignacion.LiquidacionEventoDTO;
import com.festival.application.usecase.asignacion.AsignacionPersonalUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
@RequiredArgsConstructor
public class AsignacionPersonalController {

    private final AsignacionPersonalUseCase asignacionUseCase;

    @PostMapping
    public ResponseEntity<AsignacionPersonalResponseDTO> crear(
            @RequestBody AsignacionPersonalRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asignacionUseCase.crearAsignacion(requestDTO));
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> porEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorEvento(eventoId));
    }

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<AsignacionPersonalResponseDTO>> porPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(asignacionUseCase.obtenerPorPersonal(personalId));
    }

    @PatchMapping("/{id}/confirmar-asistencia")
    public ResponseEntity<Void> confirmarAsistencia(@PathVariable Long id) {
        asignacionUseCase.confirmarAsistencia(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        asignacionUseCase.desactivarAsignacion(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignacionUseCase.eliminarAsignacion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/evento/{eventoId}/liquidar")
    public ResponseEntity<LiquidacionEventoDTO> liquidar(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asignacionUseCase.ejecutarLiquidacion(eventoId));
    }

    @GetMapping("/evento/{eventoId}/liquidar")
    public ResponseEntity<LiquidacionEventoDTO> previsualizarLiquidacion(@PathVariable Long eventoId) {
        return ResponseEntity.ok(asignacionUseCase.liquidarEvento(eventoId));
    }
}
