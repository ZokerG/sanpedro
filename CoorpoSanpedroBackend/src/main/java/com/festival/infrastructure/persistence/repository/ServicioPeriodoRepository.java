package com.festival.infrastructure.persistence.repository;

import com.festival.entity.ServicioPeriodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioPeriodoRepository extends JpaRepository<ServicioPeriodo, Long> {
    List<ServicioPeriodo> findByFestivalId(Long festivalId);
}
