package com.festival.infrastructure.web.controller;

import com.festival.application.dto.tipocuenta.TipoCuentaBancariaDTO;
import com.festival.application.dto.tipocuenta.TipoCuentaBancariaRequestDTO;
import com.festival.application.usecase.tipocuenta.TipoCuentaBancariaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-cuenta-bancaria")
@RequiredArgsConstructor
@Tag(name = "Tipos de Cuenta", description = "Gestión de tipos de cuenta bancaria")
public class TipoCuentaBancariaController {

    private final TipoCuentaBancariaUseCase useCase;

    @GetMapping
    @Operation(summary = "Listar tipos de cuenta", description = "Si ?activo=true solo retorna activos")
    public ResponseEntity<List<TipoCuentaBancariaDTO>> getAll(@RequestParam(required = false, defaultValue = "false") boolean activo) {
        if (activo) {
            return ResponseEntity.ok(useCase.obtenerActivos());
        }
        return ResponseEntity.ok(useCase.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoCuentaBancariaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.obtenerTipoCuenta(id));
    }

    @PostMapping
    @Operation(summary = "Crear tipo de cuenta")
    public ResponseEntity<TipoCuentaBancariaDTO> create(@Valid @RequestBody TipoCuentaBancariaRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.crearTipoCuenta(requestDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar tipo de cuenta")
    public ResponseEntity<TipoCuentaBancariaDTO> update(@PathVariable Long id, @Valid @RequestBody TipoCuentaBancariaRequestDTO requestDTO) {
        return ResponseEntity.ok(useCase.actualizarTipoCuenta(id, requestDTO));
    }

    @PatchMapping("/{id}/toggle-activo")
    @Operation(summary = "Activar/desactivar tipo de cuenta")
    public ResponseEntity<Void> toggleActivo(@PathVariable Long id) {
        useCase.toggleActivo(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar tipo de cuenta")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        useCase.eliminarTipoCuenta(id);
        return ResponseEntity.noContent().build();
    }
}
