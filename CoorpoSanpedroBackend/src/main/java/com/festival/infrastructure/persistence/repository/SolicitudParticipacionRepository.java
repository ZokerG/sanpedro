package com.festival.infrastructure.persistence.repository;

import com.festival.entity.EstadoSolicitud;
import com.festival.entity.SolicitudParticipacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudParticipacionRepository extends JpaRepository<SolicitudParticipacion, Long> {

    /** Solicitudes de un personal específico */
    List<SolicitudParticipacion> findByPersonalIdOrderByFechaSolicitudDesc(Long personalId);

    /** Solicitudes para un evento específico */
    List<SolicitudParticipacion> findByEventoIdOrderByFechaSolicitudDesc(Long eventoId);

    /** Solicitudes pendientes para un evento */
    List<SolicitudParticipacion> findByEventoIdAndEstado(Long eventoId, EstadoSolicitud estado);

    /** Verificar si ya existe una solicitud activa del mismo personal para el mismo evento */
    Optional<SolicitudParticipacion> findByPersonalIdAndEventoIdAndEstadoIn(
            Long personalId, Long eventoId, List<EstadoSolicitud> estados);

    /** Contar solicitudes aprobadas para un evento */
    long countByEventoIdAndEstado(Long eventoId, EstadoSolicitud estado);
}
