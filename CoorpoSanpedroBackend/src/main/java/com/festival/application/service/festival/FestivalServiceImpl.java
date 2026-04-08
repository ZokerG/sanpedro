package com.festival.application.service.festival;

import com.festival.application.dto.festival.FestivalRequestDTO;
import com.festival.application.dto.festival.FestivalResponseDTO;
import com.festival.application.usecase.festival.FestivalUseCase;
import com.festival.entity.Festival;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FestivalServiceImpl implements FestivalUseCase {

    private final FestivalRepository festivalRepository;

    @Override
    @Transactional
    public FestivalResponseDTO crearFestival(FestivalRequestDTO requestDTO) {
        if (festivalRepository.existsByAnio(requestDTO.getAnio())) {
            throw new IllegalArgumentException("Ya existe un festival para el año " + requestDTO.getAnio());
        }

        Festival festival = new Festival();
        mapToEntity(requestDTO, festival);
        
        Festival guardado = festivalRepository.save(festival);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public FestivalResponseDTO actualizarFestival(Long id, FestivalRequestDTO requestDTO) {
        Festival festival = festivalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + id));
                
        // Verificar si se cambia el año a uno que ya existe
        if (!festival.getAnio().equals(requestDTO.getAnio()) && festivalRepository.existsByAnio(requestDTO.getAnio())) {
            throw new IllegalArgumentException("Ya existe un festival para el año " + requestDTO.getAnio());
        }

        mapToEntity(requestDTO, festival);
        
        Festival actualizado = festivalRepository.save(festival);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public FestivalResponseDTO obtenerFestival(Long id) {
        Festival festival = festivalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + id));
        return mapToDTO(festival);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FestivalResponseDTO> obtenerTodos() {
        return festivalRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarFestival(Long id) {
        if (!festivalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Festival no encontrado con ID: " + id);
        }
        festivalRepository.deleteById(id);
    }

    private void mapToEntity(FestivalRequestDTO dto, Festival entity) {
        entity.setNombre(dto.getNombre());
        entity.setVersion(dto.getVersion());
        entity.setAnio(dto.getAnio());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setEstado(dto.getEstado());
    }

    private FestivalResponseDTO mapToDTO(Festival entity) {
        FestivalResponseDTO dto = new FestivalResponseDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setVersion(entity.getVersion());
        dto.setAnio(entity.getAnio());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setEstado(entity.getEstado());
        return dto;
    }
}
