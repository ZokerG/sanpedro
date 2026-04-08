package com.festival.infrastructure.persistence.repository;

import com.festival.entity.TareaPadre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaPadreRepository extends JpaRepository<TareaPadre, Long> {
    List<TareaPadre> findByEventoId(Long eventoId);
}
