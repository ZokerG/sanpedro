package com.festival.infrastructure.persistence.repository;

import com.festival.entity.UbicacionPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UbicacionPersonalRepository extends JpaRepository<UbicacionPersonal, Long> {

    Optional<UbicacionPersonal> findTopByJornadaIdOrderByTimestampDesc(Long jornadaId);

    List<UbicacionPersonal> findByJornadaIdOrderByTimestampAsc(Long jornadaId);

    @Query("SELECT u FROM UbicacionPersonal u WHERE u.jornada.id IN :jornadaIds ORDER BY u.timestamp DESC")
    List<UbicacionPersonal> findLatestByJornadaIds(@Param("jornadaIds") List<Long> jornadaIds);
}
