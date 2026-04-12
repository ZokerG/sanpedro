package com.festival.infrastructure.web.controller;

import com.festival.application.dto.asistencia.EscanearQrRequestDTO;
import com.festival.application.dto.asistencia.EscanearQrResponseDTO;
import com.festival.application.dto.asistencia.RegistroAsistenciaDTO;
import com.festival.application.usecase.asistencia.AsistenciaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
@RequiredArgsConstructor
@Tag(name = "Asistencia", description = "Control de asistencia por QR — usado por la app escáner")
public class AsistenciaController {

    private final AsistenciaUseCase asistenciaUseCase;

    /**
     * Endpoint principal para la app escáner.
     * Recibe el código QR del logístico y el ID del evento.
     * Responde con INGRESO, SALIDA o RECHAZADO.
     */
    @PostMapping("/escanear")
    @Operation(summary = "Procesar escaneo QR", description = "Registra ingreso o salida del logístico al evento")
    public ResponseEntity<EscanearQrResponseDTO> escanear(
            @Valid @RequestBody EscanearQrRequestDTO dto) {
        return ResponseEntity.ok(asistenciaUseCase.escanear(dto));
    }

    /**
     * Lista todos los registros de asistencia de un evento en orden cronológico inverso.
     * Útil para el panel en tiempo real de la app escáner.
     */
    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar registros de un evento", description = "Devuelve todos los escaneos del evento en orden descendente")
    public ResponseEntity<List<RegistroAsistenciaDTO>> porEvento(
            @PathVariable Long eventoId) {
        return ResponseEntity.ok(asistenciaUseCase.obtenerPorEvento(eventoId));
    }
}
