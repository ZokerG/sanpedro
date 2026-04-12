package com.festival.infrastructure.persistence.repository;

import com.festival.entity.CarteraLogistico;
import com.festival.entity.EstadoCartera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarteraLogisticoRepository extends JpaRepository<CarteraLogistico, Long> {

    List<CarteraLogistico> findByPersonalIdOrderByFechaLiquidacionDesc(Long personalId);

    List<CarteraLogistico> findByPersonalIdAndEstadoOrderByFechaLiquidacionDesc(Long personalId, EstadoCartera estado);

    Optional<CarteraLogistico> findByPersonalIdAndEventoId(Long personalId, Long eventoId);

    boolean existsByPersonalIdAndEventoId(Long personalId, Long eventoId);

    /**
     * Total acumulado pendiente de cobro de un logístico.
     */
    @Query("SELECT COALESCE(SUM(c.monto), 0) FROM CarteraLogistico c " +
           "WHERE c.personal.id = :personalId AND c.estado = 'PENDIENTE_COBRO'")
    BigDecimal sumMontoPendienteByPersonalId(@Param("personalId") Long personalId);

    /**
     * Vista admin: todos los registros pendientes de todos los logísticos.
     */
    List<CarteraLogistico> findByEstadoOrderByFechaLiquidacionDesc(EstadoCartera estado);
}
