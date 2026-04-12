package com.festival.infrastructure.web.controller;

import com.festival.application.dto.documento.DocumentoPersonalDTO;
import com.festival.application.service.documento.DocumentoPersonalService;
import com.festival.entity.EstadoDocumento;
import com.festival.entity.TipoDocumentoRequerido;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@RequiredArgsConstructor
@Tag(name = "Documentos Personal", description = "Gestión de expediente documental del personal")
@CrossOrigin(origins = "*")
public class DocumentoPersonalController {

    private final DocumentoPersonalService documentoPersonalService;

    @Operation(summary = "Subir un documento para un personal específico")
    @PostMapping(value = "/{personalId}/documentos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoPersonalDTO> uploadDocumento(
            @PathVariable Long personalId,
            @RequestParam("tipo") TipoDocumentoRequerido tipo,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(documentoPersonalService.uploadDocumento(personalId, tipo, file));
    }

    @Operation(summary = "Listar documentos de un personal")
    @GetMapping("/{personalId}/documentos")
    public ResponseEntity<List<DocumentoPersonalDTO>> getDocumentosByPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(documentoPersonalService.getDocumentosByPersonal(personalId));
    }

    @Operation(summary = "Actualizar estado de un documento (Verificación)")
    @PatchMapping("/documentos/{documentoId}/estado")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_LOGISTICA', 'ADMIN_PRENSA', 'ADMIN_ADMINISTRATIVO')")
    public ResponseEntity<DocumentoPersonalDTO> updateEstado(
            @PathVariable Long documentoId,
            @RequestParam EstadoDocumento estado,
            @RequestParam(required = false) String notaRevision) {
        return ResponseEntity.ok(documentoPersonalService.updateEstado(documentoId, estado, notaRevision));
    }

    @Operation(summary = "Eliminar un documento")
    @DeleteMapping("/documentos/{documentoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Long documentoId) {
        documentoPersonalService.deleteDocumento(documentoId);
        return ResponseEntity.noContent().build();
    }
}
