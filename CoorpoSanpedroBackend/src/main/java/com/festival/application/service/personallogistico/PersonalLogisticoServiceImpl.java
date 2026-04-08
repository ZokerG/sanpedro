package com.festival.application.service.personallogistico;

import com.festival.application.dto.personallogistico.PersonalLogisticoRequestDTO;
import com.festival.application.dto.personallogistico.PersonalLogisticoResponseDTO;
import com.festival.application.usecase.personallogistico.PersonalLogisticoUseCase;
import com.festival.entity.PersonalLogistico;
import com.festival.infrastructure.persistence.repository.PersonalLogisticoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalLogisticoServiceImpl implements PersonalLogisticoUseCase {

    private final PersonalLogisticoRepository repository;

    @Override
    @Transactional
    public PersonalLogisticoResponseDTO crear(PersonalLogisticoRequestDTO requestDTO) {
        if (repository.existsByNumeroCamiseta(requestDTO.getNumeroCamiseta())) {
            throw new IllegalStateException(
                "Ya existe personal con el número de camiseta: " + requestDTO.getNumeroCamiseta());
        }

        PersonalLogistico personal = new PersonalLogistico();
        personal.setNombre(requestDTO.getNombre());
        personal.setApellido(requestDTO.getApellido());
        personal.setNumeroCamiseta(requestDTO.getNumeroCamiseta());
        personal.setCodigoQr(UUID.randomUUID().toString());
        personal.setActivo(true);

        return mapToDTO(repository.save(personal));
    }

    @Override
    @Transactional
    public PersonalLogisticoResponseDTO actualizar(Long id, PersonalLogisticoRequestDTO requestDTO) {
        PersonalLogistico personal = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal logístico no encontrado con ID: " + id));

        if (!personal.getNumeroCamiseta().equals(requestDTO.getNumeroCamiseta())
                && repository.existsByNumeroCamiseta(requestDTO.getNumeroCamiseta())) {
            throw new IllegalStateException(
                "Ya existe personal con el número de camiseta: " + requestDTO.getNumeroCamiseta());
        }

        personal.setNombre(requestDTO.getNombre());
        personal.setApellido(requestDTO.getApellido());
        personal.setNumeroCamiseta(requestDTO.getNumeroCamiseta());

        return mapToDTO(repository.save(personal));
    }

    @Override
    @Transactional(readOnly = true)
    public PersonalLogisticoResponseDTO obtenerPorId(Long id) {
        return mapToDTO(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal logístico no encontrado con ID: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalLogisticoResponseDTO> listarTodos() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalLogisticoResponseDTO> listarActivos() {
        return repository.findByActivoTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        PersonalLogistico personal = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal logístico no encontrado con ID: " + id));
        personal.setActivo(false);
        repository.save(personal);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Personal logístico no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }

    private PersonalLogisticoResponseDTO mapToDTO(PersonalLogistico entity) {
        PersonalLogisticoResponseDTO dto = new PersonalLogisticoResponseDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setNumeroCamiseta(entity.getNumeroCamiseta());
        dto.setCodigoQr(entity.getCodigoQr());
        dto.setActivo(entity.isActivo());
        return dto;
    }
}
