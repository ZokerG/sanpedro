package com.festival.infrastructure.web.controller;

import com.festival.application.dto.solicitud.SolicitudParticipacionDTO;
import com.festival.application.dto.solicitud.SolicitudParticipacionRequestDTO;
import com.festival.application.usecase.solicitud.SolicitudParticipacionUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@Tag(name = "Solicitudes de Participación", description = "Solicitudes de personal logístico para participar en eventos")
public class SolicitudParticipacionController {

    private final SolicitudParticipacionUseCase useCase;

    @Operation(summary = "Personal solicita participar en un evento")
    @PostMapping("/personal/{personalId}")
    public ResponseEntity<SolicitudParticipacionDTO> crearSolicitud(
            @PathVariable Long personalId,
            @Valid @RequestBody SolicitudParticipacionRequestDTO requestDTO) {
        SolicitudParticipacionDTO response = useCase.crearSolicitud(personalId, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Mis solicitudes de participación")
    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<SolicitudParticipacionDTO>> getMisSolicitudes(@PathVariable Long personalId) {
        return ResponseEntity.ok(useCase.obtenerMisSolicitudes(personalId));
    }

    @Operation(summary = "Solicitudes para un evento (admin)")
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<SolicitudParticipacionDTO>> getPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(useCase.obtenerPorEvento(eventoId));
    }

    @Operation(summary = "Solicitudes pendientes para un evento (admin)")
    @GetMapping("/evento/{eventoId}/pendientes")
    public ResponseEntity<List<SolicitudParticipacionDTO>> getPendientes(@PathVariable Long eventoId) {
        return ResponseEntity.ok(useCase.obtenerPendientesPorEvento(eventoId));
    }

    @Operation(summary = "Aprobar solicitud (admin)")
    @PatchMapping("/{solicitudId}/aprobar")
    public ResponseEntity<SolicitudParticipacionDTO> aprobar(@PathVariable Long solicitudId) {
        return ResponseEntity.ok(useCase.aprobarSolicitud(solicitudId));
    }

    @Operation(summary = "Rechazar solicitud (admin)")
    @PatchMapping("/{solicitudId}/rechazar")
    public ResponseEntity<SolicitudParticipacionDTO> rechazar(
            @PathVariable Long solicitudId,
            @RequestParam(required = false) String nota) {
        return ResponseEntity.ok(useCase.rechazarSolicitud(solicitudId, nota));
    }

    @Operation(summary = "Cancelar mi solicitud")
    @PatchMapping("/{solicitudId}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long solicitudId) {
        useCase.cancelarSolicitud(solicitudId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Detalle de una solicitud")
    @GetMapping("/{solicitudId}")
    public ResponseEntity<SolicitudParticipacionDTO> getDetalle(@PathVariable Long solicitudId) {
        return ResponseEntity.ok(useCase.obtenerSolicitud(solicitudId));
    }
}
