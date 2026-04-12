package com.festival.infrastructure.persistence.repository;

import com.festival.entity.Personal;
import com.festival.entity.TipoPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalRepository extends JpaRepository<Personal, Long> {
    List<Personal> findByTipoPersonal(TipoPersonal tipoPersonal);
    List<Personal> findByTipoPersonalAndActivoTrue(TipoPersonal tipoPersonal);
    List<Personal> findByActivoTrue();
    Optional<Personal> findByNumeroDocumento(String numeroDocumento);
    boolean existsByNumeroDocumento(String numeroDocumento);
    boolean existsByNumeroCamiseta(Integer numeroCamiseta);
}
