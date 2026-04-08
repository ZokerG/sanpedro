package com.festival.application.service.usoservicioperiodo;

import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoRequestDTO;
import com.festival.application.dto.usoservicioperiodo.UsoServicioPeriodoResponseDTO;
import com.festival.application.usecase.usoservicioperiodo.UsoServicioPeriodoUseCase;
import com.festival.entity.Evento;
import com.festival.entity.ServicioPeriodo;
import com.festival.entity.UsoServicioPeriodo;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.ServicioPeriodoRepository;
import com.festival.infrastructure.persistence.repository.UsoServicioPeriodoRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsoServicioPeriodoServiceImpl implements UsoServicioPeriodoUseCase {

    private final UsoServicioPeriodoRepository usoRepository;
    private final ServicioPeriodoRepository servicioRepository;
    private final EventoRepository eventoRepository;

    @Override
    @Transactional
    public UsoServicioPeriodoResponseDTO crearUso(UsoServicioPeriodoRequestDTO requestDTO) {
        UsoServicioPeriodo uso = new UsoServicioPeriodo();
        mapToEntity(requestDTO, uso);
        UsoServicioPeriodo guardado = usoRepository.save(uso);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public UsoServicioPeriodoResponseDTO actualizarUso(Long id, UsoServicioPeriodoRequestDTO requestDTO) {
        UsoServicioPeriodo uso = usoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uso de servicio no encontrado con ID: " + id));
        mapToEntity(requestDTO, uso);
        UsoServicioPeriodo actualizado = usoRepository.save(uso);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public UsoServicioPeriodoResponseDTO obtenerUso(Long id) {
        UsoServicioPeriodo uso = usoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uso de servicio no encontrado con ID: " + id));
        return mapToDTO(uso);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsoServicioPeriodoResponseDTO> obtenerTodos() {
        return usoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsoServicioPeriodoResponseDTO> obtenerPorServicio(Long servicioId) {
        return usoRepository.findByServicioId(servicioId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsoServicioPeriodoResponseDTO> obtenerPorEvento(Long eventoId) {
        return usoRepository.findByEventoId(eventoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarUso(Long id) {
        if (!usoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Uso de servicio no encontrado con ID: " + id);
        }
        usoRepository.deleteById(id);
    }

    private void mapToEntity(UsoServicioPeriodoRequestDTO dto, UsoServicioPeriodo entity) {
        ServicioPeriodo servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID: " + dto.getServicioId()));
        entity.setServicio(servicio);
        
        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));
        entity.setEvento(evento);
        
        entity.setFechaUso(dto.getFechaUso());
        entity.setDescripcionUso(dto.getDescripcionUso());
    }

    private UsoServicioPeriodoResponseDTO mapToDTO(UsoServicioPeriodo entity) {
        UsoServicioPeriodoResponseDTO dto = new UsoServicioPeriodoResponseDTO();
        dto.setId(entity.getId());
        dto.setServicioId(entity.getServicio().getId());
        dto.setEventoId(entity.getEvento().getId());
        dto.setFechaUso(entity.getFechaUso());
        dto.setDescripcionUso(entity.getDescripcionUso());
        return dto;
    }
}
