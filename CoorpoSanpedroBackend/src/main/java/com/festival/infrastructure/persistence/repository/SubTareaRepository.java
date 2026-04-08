package com.festival.infrastructure.persistence.repository;

import com.festival.entity.SubTarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubTareaRepository extends JpaRepository<SubTarea, Long> {
    List<SubTarea> findByTareaPadreId(Long tareaPadreId);
}
