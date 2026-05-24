package com.festival.application.usecase.noticia;

import com.festival.application.dto.noticia.NoticiaRequestDTO;
import com.festival.application.dto.noticia.NoticiaResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface NoticiaUseCase {

    NoticiaResponseDTO crear(Long autorId, NoticiaRequestDTO dto, MultipartFile imagen);

    NoticiaResponseDTO actualizar(Long id, NoticiaRequestDTO dto, MultipartFile imagen);

    void eliminar(Long id);

    List<NoticiaResponseDTO> obtenerTodas();

    List<NoticiaResponseDTO> obtenerDestacadas();

    List<NoticiaResponseDTO> obtenerPorPlanta(String planta);

    NoticiaResponseDTO obtenerPorId(Long id);
}
