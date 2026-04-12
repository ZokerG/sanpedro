package com.festival.infrastructure.config;

import com.festival.entity.Banco;
import com.festival.entity.Rol;
import com.festival.entity.TipoCuentaBancaria;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.BancoRepository;
import com.festival.infrastructure.persistence.repository.RolRepository;
import com.festival.infrastructure.persistence.repository.TipoCuentaBancariaRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;
    private final BancoRepository bancoRepository;
    private final TipoCuentaBancariaRepository tipoCuentaBancariaRepository;

    @Override
    public void run(String... args) throws Exception {

        // ─── Bancos ─────────────────────────────────────────
        inicializarBancos(List.of(
                "BANCOLOMBIA", "DAVIVIENDA", "BANCO_DE_BOGOTA", "BBVA",
                "BANCO_DE_OCCIDENTE", "AV_VILLAS", "BANCO_POPULAR",
                "NEQUI", "DAVIPLATA", "BANCO_AGRARIO", "COOPERATIVA"
        ));

        // ─── Tipos de Cuenta ────────────────────────────────
        inicializarTiposCuenta(List.of(
                "AHORROS", "CORRIENTE", "DEPOSITO_BAJO_MONTO"
        ));

        // ─── Roles de cargos organizacionales (para Personal) ──
        insertarRolSiNoExiste("DIRECTOR");
        insertarRolSiNoExiste("COORDINADOR");
        insertarRolSiNoExiste("EJECUTOR");
        insertarRolSiNoExiste("AUDITOR");
        insertarRolSiNoExiste("ASISTENTE");

        // ─── Roles de acceso al sistema (para Usuarios) ────────
        insertarRolSiNoExiste("SUPER_ADMIN");
        insertarRolSiNoExiste("ADMIN_LOGISTICA");
        insertarRolSiNoExiste("ADMIN_PRENSA");
        insertarRolSiNoExiste("ADMIN_ADMINISTRATIVO");

        // ─── Usuario administrador inicial ─────────────────────
        if (usuarioRepository.count() == 0) {
            Rol adminRol = rolRepository.findByNombre("SUPER_ADMIN").orElseThrow();
            Usuario initialAdmin = Usuario.builder()
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .email("admin@corposanpedro.com")
                    .password(passwordEncoder.encode("admin1234"))
                    .rol(adminRol)
                    .activo(true)
                    .build();
            usuarioRepository.save(initialAdmin);
        }
    }

    private void insertarRolSiNoExiste(String nombre) {
        if (rolRepository.findByNombre(nombre).isEmpty()) {
            rolRepository.save(new Rol(nombre));
        }
    }

    private void inicializarBancos(List<String> nombres) {
        for (String nombre : nombres) {
            if (bancoRepository.findByNombre(nombre).isEmpty()) {
                bancoRepository.save(new Banco(nombre));
            }
        }
    }

    private void inicializarTiposCuenta(List<String> nombres) {
        for (String nombre : nombres) {
            if (tipoCuentaBancariaRepository.findByNombre(nombre).isEmpty()) {
                tipoCuentaBancariaRepository.save(new TipoCuentaBancaria(nombre));
            }
        }
    }
}
