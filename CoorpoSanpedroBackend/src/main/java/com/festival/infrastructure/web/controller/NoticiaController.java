package com.festival.infrastructure.web.controller;

import com.festival.application.dto.noticia.NoticiaRequestDTO;
import com.festival.application.dto.noticia.NoticiaResponseDTO;
import com.festival.application.usecase.noticia.NoticiaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
@Tag(name = "Noticias", description = "Publicación de anuncios y noticias por planta")
@CrossOrigin(origins = "*")
public class NoticiaController {

    private final NoticiaUseCase useCase;

    @Operation(summary = "Crear noticia (gerente)")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticiaResponseDTO> crear(
            @RequestParam("autorId") Long autorId,
            @Valid @RequestPart("noticia") NoticiaRequestDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.crear(autorId, dto, imagen));
    }

    @Operation(summary = "Actualizar noticia")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NoticiaResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestPart("noticia") NoticiaRequestDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen) {
        return ResponseEntity.ok(useCase.actualizar(id, dto, imagen));
    }

    @Operation(summary = "Eliminar noticia")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        useCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar todas las noticias")
    @GetMapping
    public ResponseEntity<List<NoticiaResponseDTO>> obtenerTodas() {
        return ResponseEntity.ok(useCase.obtenerTodas());
    }

    @Operation(summary = "Listar noticias destacadas")
    @GetMapping("/destacadas")
    public ResponseEntity<List<NoticiaResponseDTO>> obtenerDestacadas() {
        return ResponseEntity.ok(useCase.obtenerDestacadas());
    }

    @Operation(summary = "Listar noticias por planta (incluye globales)")
    @GetMapping("/planta/{planta}")
    public ResponseEntity<List<NoticiaResponseDTO>> obtenerPorPlanta(@PathVariable String planta) {
        return ResponseEntity.ok(useCase.obtenerPorPlanta(planta));
    }

    @Operation(summary = "Detalle de una noticia")
    @GetMapping("/{id}")
    public ResponseEntity<NoticiaResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.obtenerPorId(id));
    }
}
