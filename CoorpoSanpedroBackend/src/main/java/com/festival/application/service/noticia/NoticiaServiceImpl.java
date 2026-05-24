package com.festival.application.service.noticia;

import com.festival.application.dto.noticia.NoticiaRequestDTO;
import com.festival.application.dto.noticia.NoticiaResponseDTO;
import com.festival.application.usecase.noticia.NoticiaUseCase;
import com.festival.entity.Noticia;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.NoticiaRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.fcm.FcmService;
import com.festival.infrastructure.s3.S3StorageService;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticiaServiceImpl implements NoticiaUseCase {

    private final NoticiaRepository noticiaRepository;
    private final UsuarioRepository usuarioRepository;
    private final S3StorageService s3StorageService;
    private final FcmService fcmService;

    @Override
    @Transactional
    public NoticiaResponseDTO crear(Long autorId, NoticiaRequestDTO dto, MultipartFile imagen) {
        Usuario autor = usuarioRepository.findById(autorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + autorId));

        Noticia noticia = new Noticia();
        noticia.setAutor(autor);
        noticia.setTitulo(dto.getTitulo());
        noticia.setContenido(dto.getContenido());
        noticia.setPlanta(dto.getPlanta());
        noticia.setDestacada(dto.isDestacada());
        noticia.setFechaPublicacion(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        if (imagen != null && !imagen.isEmpty()) {
            try {
                String objectKey = "noticias/" + UUID.randomUUID() + "_" + imagen.getOriginalFilename();
                noticia.setImagenRuta(s3StorageService.uploadFile(objectKey, imagen));
            } catch (IOException e) {
                throw new RuntimeException("Error al subir la imagen de la noticia", e);
            }
        }

        Noticia saved = noticiaRepository.save(noticia);

        fcmService.enviarATodos(
            "Nuevo anuncio: " + dto.getTitulo(),
            dto.getContenido().length() > 100 ? dto.getContenido().substring(0, 100) + "..." : dto.getContenido(),
            java.util.Map.of("tipo", "noticia", "noticiaId", saved.getId().toString())
        );

        return toResponseDTO(saved);
    }

    @Override
    @Transactional
    public NoticiaResponseDTO actualizar(Long id, NoticiaRequestDTO dto, MultipartFile imagen) {
        Noticia noticia = noticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrada con ID: " + id));

        noticia.setTitulo(dto.getTitulo());
        noticia.setContenido(dto.getContenido());
        noticia.setPlanta(dto.getPlanta());
        noticia.setDestacada(dto.isDestacada());

        if (imagen != null && !imagen.isEmpty()) {
            try {
                if (noticia.getImagenRuta() != null) {
                    try { s3StorageService.deleteFile(noticia.getImagenRuta()); } catch (Exception ignored) {}
                }
                String objectKey = "noticias/" + UUID.randomUUID() + "_" + imagen.getOriginalFilename();
                noticia.setImagenRuta(s3StorageService.uploadFile(objectKey, imagen));
            } catch (IOException e) {
                throw new RuntimeException("Error al subir la imagen de la noticia", e);
            }
        }

        return toResponseDTO(noticiaRepository.save(noticia));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Noticia noticia = noticiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrada con ID: " + id));

        if (noticia.getImagenRuta() != null) {
            try { s3StorageService.deleteFile(noticia.getImagenRuta()); } catch (Exception ignored) {}
        }

        noticiaRepository.delete(noticia);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticiaResponseDTO> obtenerTodas() {
        return noticiaRepository.findAllWithAutor().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticiaResponseDTO> obtenerDestacadas() {
        return noticiaRepository.findDestacadasWithAutor().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticiaResponseDTO> obtenerPorPlanta(String planta) {
        return noticiaRepository.findByPlantaOrGlobalWithAutor(planta).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NoticiaResponseDTO obtenerPorId(Long id) {
        return noticiaRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Noticia no encontrada con ID: " + id));
    }

    private NoticiaResponseDTO toResponseDTO(Noticia n) {
        NoticiaResponseDTO dto = new NoticiaResponseDTO();
        dto.setId(n.getId());
        dto.setAutorNombre(n.getAutor().getNombre() + " " + n.getAutor().getApellido());
        dto.setTitulo(n.getTitulo());
        dto.setContenido(n.getContenido());
        dto.setPlanta(n.getPlanta());
        dto.setDestacada(n.isDestacada());
        dto.setFechaPublicacion(n.getFechaPublicacion());
        dto.setImagenPresignedUrl(s3StorageService.getPresignedUrl(n.getImagenRuta()));
        dto.setCreatedAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
        return dto;
    }
}
