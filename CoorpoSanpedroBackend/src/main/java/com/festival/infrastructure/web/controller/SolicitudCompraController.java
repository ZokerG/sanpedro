package com.festival.infrastructure.web.controller;

import com.festival.application.dto.solicitudcompra.SolicitudCompraRequestDTO;
import com.festival.application.dto.solicitudcompra.SolicitudCompraResponseDTO;
import com.festival.application.usecase.solicitudcompra.SolicitudCompraUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-compra")
@RequiredArgsConstructor
@Tag(name = "Solicitudes de Compra", description = "Gestión de solicitudes de compra y flujo de aprobación gerencial")
@CrossOrigin(origins = "*")
public class SolicitudCompraController {

    private final SolicitudCompraUseCase useCase;

    @Operation(summary = "Crear solicitud de compra con foto del recibo")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SolicitudCompraResponseDTO> crear(
            @RequestParam("personalId") Long personalId,
            @Valid @RequestPart("solicitud") SolicitudCompraRequestDTO requestDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.crearSolicitud(personalId, requestDTO, foto));
    }

    @Operation(summary = "Listar todas las solicitudes de compra")
    @GetMapping
    public ResponseEntity<List<SolicitudCompraResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(useCase.obtenerTodas());
    }

    @Operation(summary = "Listar solicitudes pendientes de aprobación (gerente)")
    @GetMapping("/pendientes")
    public ResponseEntity<List<SolicitudCompraResponseDTO>> obtenerPendientes() {
        return ResponseEntity.ok(useCase.obtenerPendientes());
    }

    @Operation(summary = "Listar solicitudes de un personal específico")
    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<SolicitudCompraResponseDTO>> obtenerPorPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(useCase.obtenerPorPersonal(personalId));
    }

    @Operation(summary = "Detalle de una solicitud de compra")
    @GetMapping("/{id}")
    public ResponseEntity<SolicitudCompraResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.obtenerPorId(id));
    }

    @Operation(summary = "Aprobar solicitud (gerente)")
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<SolicitudCompraResponseDTO> aprobar(
            @PathVariable Long id,
            @RequestParam Long aprobadorId) {
        return ResponseEntity.ok(useCase.aprobar(id, aprobadorId));
    }

    @Operation(summary = "Rechazar solicitud (gerente)")
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<SolicitudCompraResponseDTO> rechazar(
            @PathVariable Long id,
            @RequestParam(required = false) String nota) {
        return ResponseEntity.ok(useCase.rechazar(id, nota));
    }

    @Operation(summary = "Registrar transferencia y subir comprobante (gerente)")
    @PostMapping(value = "/{id}/transferencia", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SolicitudCompraResponseDTO> registrarTransferencia(
            @PathVariable Long id,
            @RequestPart(value = "comprobante", required = false) MultipartFile comprobante) {
        return ResponseEntity.ok(useCase.registrarTransferencia(id, comprobante));
    }
}
