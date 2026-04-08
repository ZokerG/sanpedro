package com.festival.infrastructure.web.controller;

import com.festival.application.dto.personallogistico.PersonalLogisticoRequestDTO;
import com.festival.application.dto.personallogistico.PersonalLogisticoResponseDTO;
import com.festival.application.usecase.personallogistico.PersonalLogisticoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/personal-logistico")
@RequiredArgsConstructor
@Tag(name = "Personal Logístico", description = "Gestión del personal logístico con QR de auditoría")
public class PersonalLogisticoController {

    private final PersonalLogisticoUseCase useCase;

    @PostMapping
    @Operation(summary = "Registrar Personal", description = "Crea un nuevo miembro del personal logístico y genera su QR único.")
    public ResponseEntity<PersonalLogisticoResponseDTO> crear(@Valid @RequestBody PersonalLogisticoRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.crear(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar Personal", description = "Actualiza los datos del personal (no regenera el QR).")
    public ResponseEntity<PersonalLogisticoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PersonalLogisticoRequestDTO requestDTO) {
        return ResponseEntity.ok(useCase.actualizar(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Personal", description = "Obtiene el detalle de un miembro del personal por ID.")
    public ResponseEntity<PersonalLogisticoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.obtenerPorId(id));
    }

    @GetMapping
    @Operation(summary = "Listar Personal Activo", description = "Lista todo el personal logístico activo.")
    public ResponseEntity<List<PersonalLogisticoResponseDTO>> listarActivos() {
        return ResponseEntity.ok(useCase.listarActivos());
    }

    @PutMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar Personal", description = "Desactiva un miembro del personal (soft delete).")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        useCase.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Personal", description = "Elimina físicamente un miembro del personal.")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        useCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
