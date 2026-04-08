package com.festival.application.service.resolucion;

import com.festival.application.dto.resolucion.ResolucionRequestDTO;
import com.festival.application.dto.resolucion.ResolucionResponseDTO;
import com.festival.application.usecase.resolucion.ResolucionUseCase;
import com.festival.entity.Festival;
import com.festival.entity.Resolucion;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.ResolucionRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResolucionServiceImpl implements ResolucionUseCase {

    private final ResolucionRepository resolucionRepository;
    private final FestivalRepository festivalRepository;

    @Override
    @Transactional
    public ResolucionResponseDTO crearResolucion(ResolucionRequestDTO requestDTO) {
        if (resolucionRepository.existsByNumero(requestDTO.getNumero())) {
            throw new IllegalArgumentException("Ya existe una resolución con el número: " + requestDTO.getNumero());
        }

        Resolucion resolucion = new Resolucion();
        mapToEntity(requestDTO, resolucion);
        Resolucion guardada = resolucionRepository.save(resolucion);
        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public ResolucionResponseDTO actualizarResolucion(Long id, ResolucionRequestDTO requestDTO) {
        Resolucion resolucion = resolucionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + id));

        if (!resolucion.getNumero().equals(requestDTO.getNumero()) && resolucionRepository.existsByNumero(requestDTO.getNumero())) {
            throw new IllegalArgumentException("Ya existe otra resolución con el número: " + requestDTO.getNumero());
        }

        mapToEntity(requestDTO, resolucion);
        Resolucion actualizada = resolucionRepository.save(resolucion);
        return mapToDTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public ResolucionResponseDTO obtenerResolucion(Long id) {
        Resolucion resolucion = resolucionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + id));
        return mapToDTO(resolucion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResolucionResponseDTO> obtenerTodos() {
        return resolucionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResolucionResponseDTO> obtenerPorFestival(Long festivalId) {
        return resolucionRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarResolucion(Long id) {
        if (!resolucionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resolución no encontrada con ID: " + id);
        }
        resolucionRepository.deleteById(id);
    }

    private void mapToEntity(ResolucionRequestDTO dto, Resolucion entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        entity.setNumero(dto.getNumero());
        entity.setFecha(dto.getFecha());
        entity.setTipo(dto.getTipo());
        entity.setValorAdicion(dto.getValorAdicion());
        entity.setCdpNumero(dto.getCdpNumero());
        entity.setDescripcion(dto.getDescripcion());
    }

    private ResolucionResponseDTO mapToDTO(Resolucion entity) {
        ResolucionResponseDTO dto = new ResolucionResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        dto.setFestivalNombre(entity.getFestival().getNombre());
        dto.setNumero(entity.getNumero());
        dto.setFecha(entity.getFecha());
        dto.setTipo(entity.getTipo());
        dto.setValorAdicion(entity.getValorAdicion());
        dto.setCdpNumero(entity.getCdpNumero());
        dto.setDescripcion(entity.getDescripcion());
        return dto;
    }
}
