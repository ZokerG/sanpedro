package com.festival.infrastructure.persistence.repository;

import com.festival.entity.AsignacionPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionPersonalRepository extends JpaRepository<AsignacionPersonal, Long> {
    List<AsignacionPersonal> findByEventoId(Long eventoId);
    List<AsignacionPersonal> findByPersonalId(Long personalId);

    /**
     * Cuenta el total de asignaciones activas en un evento para validar el límite de personal.
     */
    @Query("SELECT COUNT(a) FROM AsignacionPersonal a WHERE a.evento.id = :eventoId AND a.activo = true")
    long countActivasByEventoId(@Param("eventoId") Long eventoId);

    /**
     * Cuenta asistentes confirmados (por QR) para calcular la liquidación.
     */
    @Query("SELECT COUNT(a) FROM AsignacionPersonal a WHERE a.evento.id = :eventoId AND a.asistio = true")
    long countAsistentesConfirmadosByEventoId(@Param("eventoId") Long eventoId);

    boolean existsByPersonalIdAndEventoIdAndActivoTrue(Long personalId, Long eventoId);

    java.util.Optional<AsignacionPersonal> findByPersonalIdAndEventoIdAndActivoTrue(Long personalId, Long eventoId);
}
