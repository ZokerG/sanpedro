package com.festival.infrastructure.web.controller;

import com.festival.application.dto.jornada.DashboardOperativoDTO;
import com.festival.application.usecase.jornada.JornadaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard operativo para administración")
public class DashboardController {

    private final JornadaUseCase jornadaUseCase;

    @GetMapping("/operativo")
    @Operation(summary = "Dashboard operativo: conteo de estados y personal en campo con ubicaciones")
    public ResponseEntity<DashboardOperativoDTO> operativo() {
        return ResponseEntity.ok(jornadaUseCase.obtenerDashboardOperativo());
    }
}
