package com.festival.infrastructure.web.controller;

import com.festival.infrastructure.fcm.FcmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/device-tokens")
@RequiredArgsConstructor
@Tag(name = "Device Tokens", description = "Registro de tokens FCM para notificaciones push")
@CrossOrigin(origins = "*")
public class DeviceTokenController {

    private final FcmService fcmService;

    @Operation(summary = "Registrar token FCM del dispositivo")
    @PostMapping
    public ResponseEntity<Void> registrar(@RequestBody Map<String, Object> body) {
        String usuarioId = body.get("usuarioId").toString();
        String fcmToken = body.get("fcmToken").toString();
        String plataforma = body.getOrDefault("plataforma", "ANDROID").toString();
        fcmService.registrarToken(Long.parseLong(usuarioId), fcmToken, plataforma);
        return ResponseEntity.ok().build();
    }
}
