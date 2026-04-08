package com.festival.application.service.sector;

import com.festival.application.dto.sector.SectorRequestDTO;
import com.festival.application.dto.sector.SectorResponseDTO;
import com.festival.application.usecase.sector.SectorUseCase;
import com.festival.entity.Festival;
import com.festival.entity.Sector;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.SectorRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectorServiceImpl implements SectorUseCase {

    private final SectorRepository sectorRepository;
    private final FestivalRepository festivalRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public SectorResponseDTO crearSector(SectorRequestDTO requestDTO) {
        Sector sector = new Sector();
        mapToEntity(requestDTO, sector);
        Sector guardado = sectorRepository.save(sector);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public SectorResponseDTO actualizarSector(Long id, SectorRequestDTO requestDTO) {
        Sector sector = sectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sector no encontrado con ID: " + id));
        mapToEntity(requestDTO, sector);
        Sector actualizado = sectorRepository.save(sector);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public SectorResponseDTO obtenerSector(Long id) {
        Sector sector = sectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sector no encontrado con ID: " + id));
        return mapToDTO(sector);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectorResponseDTO> obtenerTodos() {
        return sectorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectorResponseDTO> obtenerPorFestival(Long festivalId) {
        return sectorRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarSector(Long id) {
        if (!sectorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sector no encontrado con ID: " + id);
        }
        sectorRepository.deleteById(id);
    }

    private void mapToEntity(SectorRequestDTO dto, Sector entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        entity.setNombre(dto.getNombre());
        entity.setColor(dto.getColor());
        entity.setActivo(dto.isActivo());

        if (dto.getResponsableId() != null) {
            Usuario responsable = usuarioRepository.findById(dto.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario responsable no encontrado con ID: " + dto.getResponsableId()));
            entity.setResponsable(responsable);
        } else {
            entity.setResponsable(null);
        }
    }

    private SectorResponseDTO mapToDTO(Sector entity) {
        SectorResponseDTO dto = new SectorResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        dto.setFestivalNombre(entity.getFestival().getNombre());
        dto.setNombre(entity.getNombre());
        dto.setColor(entity.getColor());
        dto.setActivo(entity.isActivo());

        if (entity.getResponsable() != null) {
            dto.setResponsableId(entity.getResponsable().getId());
            dto.setResponsableNombre(entity.getResponsable().getNombre() + " " + entity.getResponsable().getApellido());
        }

        return dto;
    }
}
