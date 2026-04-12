package com.festival.infrastructure.persistence.repository;

import com.festival.entity.TipoCuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoCuentaBancariaRepository extends JpaRepository<TipoCuentaBancaria, Long> {
    Optional<TipoCuentaBancaria> findByNombre(String nombre);
    List<TipoCuentaBancaria> findByActivoTrue();
}
