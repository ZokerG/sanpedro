package com.festival.infrastructure.persistence.repository;

import com.festival.entity.PoolTransversal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoolTransversalRepository extends JpaRepository<PoolTransversal, Long> {
    List<PoolTransversal> findByFestivalId(Long festivalId);
}
