package com.festival.application.service.rol;

import com.festival.application.dto.rol.RolDTO;
import com.festival.application.dto.rol.RolRequestDTO;
import com.festival.application.mapper.RolMapper;
import com.festival.entity.Rol;
import com.festival.infrastructure.persistence.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    @Transactional(readOnly = true)
    public List<RolDTO> findAll() {
        return rolMapper.toDTOs(rolRepository.findAll());
    }

    @Transactional(readOnly = true)
    public RolDTO findById(Long id) {
        return rolRepository.findById(id)
                .map(rolMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    @Transactional
    public RolDTO create(RolRequestDTO requestDTO) {
        if (rolRepository.findByNombre(requestDTO.getNombre()).isPresent()) {
            throw new RuntimeException("Rol ya existe");
        }
        Rol entity = rolMapper.toEntity(requestDTO);
        return rolMapper.toDTO(rolRepository.save(entity));
    }

    @Transactional
    public RolDTO update(Long id, RolRequestDTO requestDTO) {
        Rol entity = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        rolRepository.findByNombre(requestDTO.getNombre())
                .filter(r -> !r.getId().equals(id))
                .ifPresent(r -> {
                    throw new RuntimeException("Nombre de rol ya en uso");
                });

        rolMapper.updateEntityFromDto(requestDTO, entity);
        return rolMapper.toDTO(rolRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        // En lugar de borrar físicamente, desactivamos
        toggleActivo(id);
    }

    @Transactional
    public void toggleActivo(Long id) {
        Rol entity = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        entity.setActivo(!entity.isActivo());
        rolRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public List<RolDTO> findAllActivos() {
        return rolMapper.toDTOs(rolRepository.findByActivoTrue());
    }
}
