package com.festival.infrastructure.config;

import com.festival.entity.Rol;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Solo inyectar si la base de datos de usuarios está vacía
        if (usuarioRepository.count() == 0) {
            Usuario initialAdmin = Usuario.builder()
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .email("admin@corposanpedro.com")
                    .password(passwordEncoder.encode("admin1234"))
                    .rol(Rol.DIRECTOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(initialAdmin);
        }
    }
}
