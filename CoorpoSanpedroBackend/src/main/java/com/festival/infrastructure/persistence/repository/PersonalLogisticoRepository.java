package com.festival.infrastructure.persistence.repository;

import com.festival.entity.PersonalLogistico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalLogisticoRepository extends JpaRepository<PersonalLogistico, Long> {

    List<PersonalLogistico> findByActivoTrue();

    Optional<PersonalLogistico> findByCodigoQr(String codigoQr);

    boolean existsByNumeroCamiseta(Integer numeroCamiseta);
}
