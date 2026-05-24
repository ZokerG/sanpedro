package com.festival.infrastructure.persistence.repository;

import com.festival.entity.EstadoSolicitudCompra;
import com.festival.entity.SolicitudCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudCompraRepository extends JpaRepository<SolicitudCompra, Long> {

    List<SolicitudCompra> findByEstadoOrderByCreatedAtDesc(EstadoSolicitudCompra estado);

    @Query("SELECT s FROM SolicitudCompra s JOIN FETCH s.personal ORDER BY s.createdAt DESC")
    List<SolicitudCompra> findAllWithPersonal();

    List<SolicitudCompra> findByPersonalIdOrderByCreatedAtDesc(Long personalId);
}
