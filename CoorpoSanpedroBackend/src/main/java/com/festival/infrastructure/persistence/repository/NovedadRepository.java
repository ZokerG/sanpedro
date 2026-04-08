package com.festival.infrastructure.persistence.repository;

import com.festival.entity.EntidadNovedad;
import com.festival.entity.Novedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NovedadRepository extends JpaRepository<Novedad, Long> {
    List<Novedad> findByFestivalId(Long festivalId);
    List<Novedad> findByTipoEntidadAndEntidadId(EntidadNovedad tipoEntidad, Long entidadId);
}
