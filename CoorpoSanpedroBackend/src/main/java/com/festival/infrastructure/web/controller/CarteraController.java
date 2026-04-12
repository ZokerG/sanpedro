package com.festival.infrastructure.web.controller;

import com.festival.application.dto.cartera.CarteraLogisticoDTO;
import com.festival.application.dto.cartera.CarteraResumenDTO;
import com.festival.application.usecase.cartera.CarteraUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cartera")
@RequiredArgsConstructor
@Tag(name = "Cartera", description = "Gestión de derechos de cobro del personal logístico")
public class CarteraController {

    private final CarteraUseCase carteraUseCase;

    /**
     * Cartera completa de un logístico: total pendiente + detalle por evento.
     * Usado por la app del logístico en la sección "Mis Pagos".
     */
    @GetMapping("/personal/{personalId}")
    @Operation(summary = "Obtener cartera del logístico", description = "Devuelve el resumen y detalle de pagos pendientes")
    public ResponseEntity<CarteraResumenDTO> carteraPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(carteraUseCase.obtenerCarteraPersonal(personalId));
    }

    /**
     * Vista admin: todas las carteras pendientes de pago.
     */
    @GetMapping("/pendientes")
    @Operation(summary = "Carteras pendientes (admin)", description = "Lista todos los registros pendientes de cobro")
    public ResponseEntity<List<CarteraLogisticoDTO>> pendientes() {
        return ResponseEntity.ok(carteraUseCase.obtenerCarterasPendientes());
    }
}
