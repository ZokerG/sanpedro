package com.festival.infrastructure.persistence.repository;

import com.festival.entity.Rol;
import com.festival.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    List<Usuario> findByRol(Rol rol);

    List<Usuario> findByRolAndActivoTrue(Rol rol);

    List<Usuario> findByActivoTrue();
}
