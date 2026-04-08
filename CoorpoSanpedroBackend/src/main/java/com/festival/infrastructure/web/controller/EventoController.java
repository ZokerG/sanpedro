package com.festival.infrastructure.web.controller;

import com.festival.application.dto.evento.EventoRequestDTO;
import com.festival.application.dto.evento.EventoResponseDTO;
import com.festival.application.usecase.evento.EventoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@Tag(name = "Eventos", description = "Endpoints para la gestión de las actividades y eventos del Festival")
public class EventoController {

    private final EventoUseCase eventoUseCase;

    @PostMapping
    @Operation(summary = "Crear Evento", description = "Registra un nuevo evento asociado a un festival.")
    public ResponseEntity<EventoResponseDTO> crearEvento(@Valid @RequestBody EventoRequestDTO requestDTO) {
        EventoResponseDTO response = eventoUseCase.crearEvento(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Evento", description = "Actualiza los datos de un evento existente.")
    public ResponseEntity<EventoResponseDTO> actualizarEvento(@PathVariable Long id, @Valid @RequestBody EventoRequestDTO requestDTO) {
        return ResponseEntity.ok(eventoUseCase.actualizarEvento(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Evento", description = "Obtiene los detalles de un evento por su ID.")
    public ResponseEntity<EventoResponseDTO> obtenerEvento(@PathVariable Long id) {
        return ResponseEntity.ok(eventoUseCase.obtenerEvento(id));
    }

    @GetMapping
    @Operation(summary = "Listar Eventos", description = "Obtiene la lista de todos los eventos.")
    public ResponseEntity<List<EventoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(eventoUseCase.obtenerTodos());
    }

    @GetMapping("/festival/{festivalId}")
    @Operation(summary = "Listar Eventos por Festival", description = "Obtiene los eventos que pertenecen a un festival específico.")
    public ResponseEntity<List<EventoResponseDTO>> obtenerPorFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(eventoUseCase.obtenerPorFestival(festivalId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Evento", description = "Elimina un evento por su ID.")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        eventoUseCase.eliminarEvento(id);
        return ResponseEntity.noContent().build();
    }
}
