package com.festival.application.service.auth;

import com.festival.application.dto.auth.AuthRequestDTO;
import com.festival.application.dto.auth.AuthResponseDTO;
import com.festival.application.usecase.auth.AuthUseCase;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthUseCase {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    public AuthResponseDTO authenticate(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo(), request.contrasena())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.correo())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado (Error Inesperado)."));

        String jwtToken = jwtService.generateToken(usuario);

        return new AuthResponseDTO(jwtToken, usuario.getEmail(), usuario.getRol().name());
    }
}
