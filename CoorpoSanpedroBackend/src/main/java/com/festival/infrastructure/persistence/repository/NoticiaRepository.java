package com.festival.infrastructure.persistence.repository;

import com.festival.entity.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {

    @Query("SELECT n FROM Noticia n JOIN FETCH n.autor ORDER BY n.fechaPublicacion DESC")
    List<Noticia> findAllWithAutor();

    @Query("SELECT n FROM Noticia n JOIN FETCH n.autor WHERE n.destacada = true ORDER BY n.fechaPublicacion DESC")
    List<Noticia> findDestacadasWithAutor();

    @Query("SELECT n FROM Noticia n JOIN FETCH n.autor WHERE n.planta IS NULL OR n.planta = :planta ORDER BY n.fechaPublicacion DESC")
    List<Noticia> findByPlantaOrGlobalWithAutor(String planta);
}
