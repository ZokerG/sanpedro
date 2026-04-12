package com.festival.application.service.banco;

import com.festival.application.dto.banco.BancoDTO;
import com.festival.application.dto.banco.BancoRequestDTO;
import com.festival.application.mapper.BancoMapper;
import com.festival.application.usecase.banco.BancoUseCase;
import com.festival.entity.Banco;
import com.festival.infrastructure.persistence.repository.BancoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BancoServiceImpl implements BancoUseCase {

    private final BancoRepository bancoRepository;
    private final BancoMapper bancoMapper;

    @Override
    @Transactional
    public BancoDTO crearBanco(BancoRequestDTO requestDTO) {
        if (bancoRepository.findByNombre(requestDTO.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un banco con el nombre: " + requestDTO.getNombre());
        }
        Banco entity = bancoMapper.toEntity(requestDTO);
        return bancoMapper.toDTO(bancoRepository.save(entity));
    }

    @Override
    @Transactional
    public BancoDTO actualizarBanco(Long id, BancoRequestDTO requestDTO) {
        Banco entity = bancoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banco no encontrado con ID: " + id));

        bancoRepository.findByNombre(requestDTO.getNombre())
                .filter(b -> !b.getId().equals(id))
                .ifPresent(b -> {
                    throw new IllegalArgumentException("Nombre de banco ya en uso");
                });

        bancoMapper.updateEntityFromDto(requestDTO, entity);
        return bancoMapper.toDTO(bancoRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public BancoDTO obtenerBanco(Long id) {
        return bancoRepository.findById(id)
                .map(bancoMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Banco no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BancoDTO> obtenerTodos() {
        return bancoMapper.toDTOs(bancoRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BancoDTO> obtenerActivos() {
        return bancoMapper.toDTOs(bancoRepository.findByActivoTrue());
    }

    @Override
    @Transactional
    public void toggleActivo(Long id) {
        Banco entity = bancoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banco no encontrado con ID: " + id));
        entity.setActivo(!entity.isActivo());
        bancoRepository.save(entity);
    }

    @Override
    @Transactional
    public void eliminarBanco(Long id) {
        if (!bancoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Banco no encontrado con ID: " + id);
        }
        bancoRepository.deleteById(id);
    }
}
