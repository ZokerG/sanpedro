package com.festival.infrastructure.persistence.repository;

import com.festival.entity.UsoServicioPeriodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsoServicioPeriodoRepository extends JpaRepository<UsoServicioPeriodo, Long> {
    List<UsoServicioPeriodo> findByServicioId(Long servicioId);
    List<UsoServicioPeriodo> findByEventoId(Long eventoId);
}
