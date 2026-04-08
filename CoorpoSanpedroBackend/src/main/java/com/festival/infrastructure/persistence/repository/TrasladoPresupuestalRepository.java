package com.festival.infrastructure.persistence.repository;

import com.festival.entity.TrasladoPresupuestal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrasladoPresupuestalRepository extends JpaRepository<TrasladoPresupuestal, Long> {
    List<TrasladoPresupuestal> findByFestivalId(Long festivalId);
}
