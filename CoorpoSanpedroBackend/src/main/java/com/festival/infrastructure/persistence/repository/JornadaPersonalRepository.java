package com.festival.infrastructure.persistence.repository;

import com.festival.entity.EstadoJornada;
import com.festival.entity.JornadaPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JornadaPersonalRepository extends JpaRepository<JornadaPersonal, Long> {

    Optional<JornadaPersonal> findByPersonalIdAndEstadoNot(Long personalId, EstadoJornada estado);

    @Query("SELECT j FROM JornadaPersonal j JOIN FETCH j.personal WHERE j.estado <> 'FIN_JORNADA'")
    List<JornadaPersonal> findActivasWithPersonal();

    @Query("SELECT j FROM JornadaPersonal j JOIN FETCH j.personal " +
           "WHERE j.personal.id = :personalId AND j.estado <> 'FIN_JORNADA'")
    Optional<JornadaPersonal> findActivaByPersonalId(@Param("personalId") Long personalId);

    List<JornadaPersonal> findByPersonalIdOrderByFechaInicioDesc(Long personalId);
}
