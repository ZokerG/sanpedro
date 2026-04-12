package com.festival.infrastructure.persistence.repository;

import com.festival.entity.DocumentoPersonal;
import com.festival.entity.TipoDocumentoRequerido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentoPersonalRepository extends JpaRepository<DocumentoPersonal, Long> {
    List<DocumentoPersonal> findByPersonalId(Long personalId);
    Optional<DocumentoPersonal> findByPersonalIdAndTipoDocumentoRequerido(Long personalId, TipoDocumentoRequerido tipo);
}
