package com.festival.application.service.subtarea;

import com.festival.application.dto.subtarea.SubTareaRequestDTO;
import com.festival.application.dto.subtarea.SubTareaResponseDTO;
import com.festival.application.usecase.subtarea.SubTareaUseCase;
import com.festival.entity.Sector;
import com.festival.entity.SubTarea;
import com.festival.entity.TareaPadre;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.SectorRepository;
import com.festival.infrastructure.persistence.repository.SubTareaRepository;
import com.festival.infrastructure.persistence.repository.TareaPadreRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubTareaServiceImpl implements SubTareaUseCase {

    private final SubTareaRepository subTareaRepository;
    private final TareaPadreRepository tareaPadreRepository;
    private final SectorRepository sectorRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public SubTareaResponseDTO crearSubTarea(SubTareaRequestDTO requestDTO) {
        SubTarea subTarea = new SubTarea();
        mapToEntity(requestDTO, subTarea);
        SubTarea guardada = subTareaRepository.save(subTarea);
        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public SubTareaResponseDTO actualizarSubTarea(Long id, SubTareaRequestDTO requestDTO) {
        SubTarea subTarea = subTareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTarea no encontrada con ID: " + id));
        mapToEntity(requestDTO, subTarea);
        SubTarea actualizada = subTareaRepository.save(subTarea);
        return mapToDTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public SubTareaResponseDTO obtenerSubTarea(Long id) {
        SubTarea subTarea = subTareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubTarea no encontrada con ID: " + id));
        return mapToDTO(subTarea);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubTareaResponseDTO> obtenerTodos() {
        return subTareaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubTareaResponseDTO> obtenerPorTareaPadre(Long tareaPadreId) {
        return subTareaRepository.findByTareaPadreId(tareaPadreId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarSubTarea(Long id) {
        if (!subTareaRepository.existsById(id)) {
            throw new ResourceNotFoundException("SubTarea no encontrada con ID: " + id);
        }
        subTareaRepository.deleteById(id);
    }

    private void mapToEntity(SubTareaRequestDTO dto, SubTarea entity) {
        TareaPadre tareaPadre = tareaPadreRepository.findById(dto.getTareaPadreId())
                .orElseThrow(() -> new ResourceNotFoundException("Tarea Padre no encontrada con ID: " + dto.getTareaPadreId()));
        entity.setTareaPadre(tareaPadre);
        
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFechaLimite(dto.getFechaLimite());
        entity.setEstado(dto.getEstado());
        entity.setValorComprometido(dto.getValorComprometido());
        entity.setValorEjecutado(dto.getValorEjecutado());

        if (dto.getSectorId() != null) {
            Sector sector = sectorRepository.findById(dto.getSectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector no encontrado con ID: " + dto.getSectorId()));
            entity.setSector(sector);
        } else {
            entity.setSector(null);
        }

        if (dto.getResponsableId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getResponsableId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + dto.getResponsableId()));
            entity.setResponsable(usuario);
        } else {
            entity.setResponsable(null);
        }
    }

    private SubTareaResponseDTO mapToDTO(SubTarea entity) {
        SubTareaResponseDTO dto = new SubTareaResponseDTO();
        dto.setId(entity.getId());
        dto.setTareaPadreId(entity.getTareaPadre().getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaLimite(entity.getFechaLimite());
        dto.setEstado(entity.getEstado());
        dto.setValorComprometido(entity.getValorComprometido());
        dto.setValorEjecutado(entity.getValorEjecutado());

        if (entity.getSector() != null) {
            dto.setSectorId(entity.getSector().getId());
        }
        if (entity.getResponsable() != null) {
            dto.setResponsableId(entity.getResponsable().getId());
            dto.setResponsableNombre(entity.getResponsable().getNombre() + " " + entity.getResponsable().getApellido());
        }

        return dto;
    }
}
