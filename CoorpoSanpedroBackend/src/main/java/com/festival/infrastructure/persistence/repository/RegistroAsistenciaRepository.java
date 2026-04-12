package com.festival.infrastructure.persistence.repository;

import com.festival.entity.RegistroAsistencia;
import com.festival.entity.TipoRegistroAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroAsistenciaRepository extends JpaRepository<RegistroAsistencia, Long> {

    List<RegistroAsistencia> findByAsignacionId(Long asignacionId);

    /**
     * Verifica si ya existe un registro de INGRESO para una asignación en un evento específico.
     */
    @Query("SELECT COUNT(r) > 0 FROM RegistroAsistencia r " +
           "WHERE r.asignacion.id = :asignacionId AND r.tipo = :tipo")
    boolean existsByAsignacionIdAndTipo(
            @Param("asignacionId") Long asignacionId,
            @Param("tipo") TipoRegistroAsistencia tipo);

    /**
     * Lista todos los registros de un evento ordenados por timestamp (para el panel en tiempo real).
     */
    @Query("SELECT r FROM RegistroAsistencia r " +
           "WHERE r.asignacion.evento.id = :eventoId " +
           "ORDER BY r.timestampRegistro DESC")
    List<RegistroAsistencia> findByEventoIdOrderByTimestampDesc(@Param("eventoId") Long eventoId);
}
