package com.festival.infrastructure.persistence.repository;

import com.festival.entity.ItemEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemEventoRepository extends JpaRepository<ItemEvento, Long> {
    List<ItemEvento> findByEventoId(Long eventoId);
}
