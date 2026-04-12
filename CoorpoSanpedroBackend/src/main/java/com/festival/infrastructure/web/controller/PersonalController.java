package com.festival.infrastructure.web.controller;

import com.festival.application.dto.personal.PerfilResponseDTO;
import com.festival.application.dto.personal.PersonalRequestDTO;
import com.festival.application.dto.personal.PersonalResponseDTO;
import com.festival.application.usecase.personal.PersonalUseCase;
import com.festival.entity.TipoPersonal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@RequiredArgsConstructor
public class PersonalController {

    private final PersonalUseCase personalUseCase;

    @GetMapping
    public ResponseEntity<List<PersonalResponseDTO>> obtenerTodos(
            @RequestParam(required = false) TipoPersonal tipo) {
        if (tipo != null) {
            return ResponseEntity.ok(personalUseCase.obtenerPorTipo(tipo));
        }
        return ResponseEntity.ok(personalUseCase.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(personalUseCase.obtenerPersonal(id));
    }

    @GetMapping("/{id}/perfil")
    public ResponseEntity<PerfilResponseDTO> obtenerPerfil(@PathVariable Long id) {
        return ResponseEntity.ok(personalUseCase.obtenerPerfil(id));
    }

    @PostMapping
    public ResponseEntity<PersonalResponseDTO> crear(@Valid @RequestBody PersonalRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personalUseCase.crearPersonal(requestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalResponseDTO> actualizar(
            @PathVariable Long id, @Valid @RequestBody PersonalRequestDTO requestDTO) {
        return ResponseEntity.ok(personalUseCase.actualizarPersonal(id, requestDTO));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        personalUseCase.desactivarPersonal(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personalUseCase.eliminarPersonal(id);
        return ResponseEntity.noContent().build();
    }
}
