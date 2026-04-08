package com.festival.infrastructure.persistence.repository;

import com.festival.entity.Resolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResolucionRepository extends JpaRepository<Resolucion, Long> {
    List<Resolucion> findByFestivalId(Long festivalId);
    boolean existsByNumero(String numero);
}
