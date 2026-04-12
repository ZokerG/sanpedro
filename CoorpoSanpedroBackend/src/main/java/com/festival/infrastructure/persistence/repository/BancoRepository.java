package com.festival.infrastructure.persistence.repository;

import com.festival.entity.Banco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BancoRepository extends JpaRepository<Banco, Long> {
    Optional<Banco> findByNombre(String nombre);
    List<Banco> findByActivoTrue();
}
