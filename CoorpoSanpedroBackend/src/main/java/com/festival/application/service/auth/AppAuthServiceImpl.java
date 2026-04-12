package com.festival.application.service.auth;

import com.festival.application.dto.auth.AppLoginInitResponseDTO;
import com.festival.application.dto.auth.AppLoginRequestDTO;
import com.festival.application.dto.auth.AppLoginResponseDTO;
import com.festival.application.dto.auth.AppOtpRequestDTO;
import com.festival.application.usecase.auth.AppAuthUseCase;
import com.festival.entity.Personal;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppAuthServiceImpl implements AppAuthUseCase {

    private final PersonalRepository personalRepository;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppLoginInitResponseDTO initLogin(AppLoginRequestDTO request) {
        Personal personal = personalRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Correo o documento incorrectos"));

        if (personal.getUsuario() == null || !personal.getUsuario().isActivo()) {
            throw new BadCredentialsException("Tu cuenta no se encuentra activa");
        }

        // La contraseña del usuario en sistema es el número de documento
        boolean valid = passwordEncoder.matches(request.documento(), personal.getUsuario().getPassword());
        if (!valid) {
            throw new BadCredentialsException("Correo o documento incorrectos");
        }

        String otp = otpService.generate(request.email());
        // TODO: reemplazar con envío real de email cuando esté configurado
        System.out.println("======================================");
        System.out.println("OTP para " + request.email() + ": " + otp);
        System.out.println("======================================");

        return new AppLoginInitResponseDTO(
                "Código de verificación enviado a tu correo",
                maskEmail(request.email())
        );
    }

    @Override
    public AppLoginResponseDTO verifyOtp(AppOtpRequestDTO request) {
        if (!otpService.verify(request.email(), request.otp())) {
            throw new BadCredentialsException("Código inválido o expirado");
        }

        Personal personal = personalRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        String token = jwtService.generateToken(personal.getUsuario());

        return new AppLoginResponseDTO(
                token,
                personal.getId(),
                personal.getNombreCompleto(),
                personal.getEmail(),
                personal.getUsuario().getRol().getNombre(),
                personal.getCodigoQr()
        );
    }

    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 2) return email;
        return email.charAt(0) + "*".repeat(at - 2) + email.substring(at - 1);
    }
}
