package com.festival.application.service.tipocuenta;

import com.festival.application.dto.tipocuenta.TipoCuentaBancariaDTO;
import com.festival.application.dto.tipocuenta.TipoCuentaBancariaRequestDTO;
import com.festival.application.mapper.TipoCuentaBancariaMapper;
import com.festival.application.usecase.tipocuenta.TipoCuentaBancariaUseCase;
import com.festival.entity.TipoCuentaBancaria;
import com.festival.infrastructure.persistence.repository.TipoCuentaBancariaRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoCuentaBancariaServiceImpl implements TipoCuentaBancariaUseCase {

    private final TipoCuentaBancariaRepository repository;
    private final TipoCuentaBancariaMapper mapper;

    @Override
    @Transactional
    public TipoCuentaBancariaDTO crearTipoCuenta(TipoCuentaBancariaRequestDTO requestDTO) {
        if (repository.findByNombre(requestDTO.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un tipo de cuenta con el nombre: " + requestDTO.getNombre());
        }
        TipoCuentaBancaria entity = mapper.toEntity(requestDTO);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public TipoCuentaBancariaDTO actualizarTipoCuenta(Long id, TipoCuentaBancariaRequestDTO requestDTO) {
        TipoCuentaBancaria entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de cuenta no encontrado con ID: " + id));

        repository.findByNombre(requestDTO.getNombre())
                .filter(e -> !e.getId().equals(id))
                .ifPresent(e -> {
                    throw new IllegalArgumentException("Nombre de tipo de cuenta ya en uso");
                });

        mapper.updateEntityFromDto(requestDTO, entity);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public TipoCuentaBancariaDTO obtenerTipoCuenta(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de cuenta no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoCuentaBancariaDTO> obtenerTodos() {
        return mapper.toDTOs(repository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoCuentaBancariaDTO> obtenerActivos() {
        return mapper.toDTOs(repository.findByActivoTrue());
    }

    @Override
    @Transactional
    public void toggleActivo(Long id) {
        TipoCuentaBancaria entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de cuenta no encontrado con ID: " + id));
        entity.setActivo(!entity.isActivo());
        repository.save(entity);
    }

    @Override
    @Transactional
    public void eliminarTipoCuenta(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Tipo de cuenta no encontrado con ID: " + id);
        }
        repository.deleteById(id);
    }
}
