package com.festival.infrastructure.persistence.repository;

import com.festival.entity.AsignacionPool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionPoolRepository extends JpaRepository<AsignacionPool, Long> {
    List<AsignacionPool> findByPoolId(Long poolId);
    List<AsignacionPool> findByEventoId(Long eventoId);
}
