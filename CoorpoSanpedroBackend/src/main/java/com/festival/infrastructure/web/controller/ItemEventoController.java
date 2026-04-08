package com.festival.infrastructure.web.controller;

import com.festival.application.dto.itemevento.ItemEventoRequestDTO;
import com.festival.application.dto.itemevento.ItemEventoResponseDTO;
import com.festival.application.usecase.itemevento.ItemEventoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items-evento")
@RequiredArgsConstructor
@Tag(name = "Items Evento", description = "Endpoints para la gestión de ítems financieros de cada Evento")
public class ItemEventoController {

    private final ItemEventoUseCase itemEventoUseCase;

    @PostMapping
    @Operation(summary = "Crear Item de Evento", description = "Registra un nuevo ítem asociado a un evento.")
    public ResponseEntity<ItemEventoResponseDTO> crearItemEvento(@Valid @RequestBody ItemEventoRequestDTO requestDTO) {
        ItemEventoResponseDTO response = itemEventoUseCase.crearItemEvento(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modificar Item de Evento", description = "Actualiza los datos de un ítem existente.")
    public ResponseEntity<ItemEventoResponseDTO> actualizarItemEvento(@PathVariable Long id, @Valid @RequestBody ItemEventoRequestDTO requestDTO) {
        return ResponseEntity.ok(itemEventoUseCase.actualizarItemEvento(id, requestDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Item de Evento", description = "Obtiene los detalles de un ítem por su ID.")
    public ResponseEntity<ItemEventoResponseDTO> obtenerItemEvento(@PathVariable Long id) {
        return ResponseEntity.ok(itemEventoUseCase.obtenerItemEvento(id));
    }

    @GetMapping
    @Operation(summary = "Listar Items de Evento", description = "Obtiene la lista de todos los ítems.")
    public ResponseEntity<List<ItemEventoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(itemEventoUseCase.obtenerTodos());
    }

    @GetMapping("/evento/{eventoId}")
    @Operation(summary = "Listar Items por Evento", description = "Obtiene los ítems operativos o financieros de un evento específico.")
    public ResponseEntity<List<ItemEventoResponseDTO>> obtenerPorEvento(@PathVariable Long eventoId) {
        return ResponseEntity.ok(itemEventoUseCase.obtenerPorEvento(eventoId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Item de Evento", description = "Elimina un ítem por su ID.")
    public ResponseEntity<Void> eliminarItemEvento(@PathVariable Long id) {
        itemEventoUseCase.eliminarItemEvento(id);
        return ResponseEntity.noContent().build();
    }
}
