package com.festival.infrastructure.persistence.repository;

import com.festival.entity.AsignacionPersonalLogistico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionPersonalLogisticoRepository extends JpaRepository<AsignacionPersonalLogistico, Long> {

    List<AsignacionPersonalLogistico> findByEventoId(Long eventoId);

    List<AsignacionPersonalLogistico> findByPersonalId(Long personalId);

    List<AsignacionPersonalLogistico> findByEventoIdAndActivoTrue(Long eventoId);

    List<AsignacionPersonalLogistico> findByPersonalIdAndActivoTrue(Long personalId);

    boolean existsByPersonalIdAndEventoId(Long personalId, Long eventoId);

    boolean existsByPersonalIdAndEventoIdAndActivoTrue(Long personalId, Long eventoId);
}
