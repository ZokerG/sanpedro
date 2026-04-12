package com.festival.infrastructure.web.controller;

import com.festival.application.dto.auth.AppLoginInitResponseDTO;
import com.festival.application.dto.auth.AppLoginRequestDTO;
import com.festival.application.dto.auth.AppLoginResponseDTO;
import com.festival.application.dto.auth.AppOtpRequestDTO;
import com.festival.application.usecase.auth.AppAuthUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/app")
@RequiredArgsConstructor
public class AppAuthController {

    private final AppAuthUseCase appAuthUseCase;

    /**
     * Paso 1: Valida correo de contacto + documento y envía OTP al correo.
     */
    @PostMapping("/login")
    public ResponseEntity<AppLoginInitResponseDTO> login(
            @Valid @RequestBody AppLoginRequestDTO request) {
        return ResponseEntity.ok(appAuthUseCase.initLogin(request));
    }

    /**
     * Paso 2: Verifica el OTP y retorna JWT + datos del personal.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AppLoginResponseDTO> verifyOtp(
            @Valid @RequestBody AppOtpRequestDTO request) {
        return ResponseEntity.ok(appAuthUseCase.verifyOtp(request));
    }
}
