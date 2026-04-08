package com.festival.application.service.itemevento;

import com.festival.application.dto.itemevento.ItemEventoRequestDTO;
import com.festival.application.dto.itemevento.ItemEventoResponseDTO;
import com.festival.application.usecase.itemevento.ItemEventoUseCase;
import com.festival.entity.Evento;
import com.festival.entity.ItemEvento;
import com.festival.entity.Resolucion;
import com.festival.infrastructure.persistence.repository.EventoRepository;
import com.festival.infrastructure.persistence.repository.ItemEventoRepository;
import com.festival.infrastructure.persistence.repository.ResolucionRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemEventoServiceImpl implements ItemEventoUseCase {

    private final ItemEventoRepository itemEventoRepository;
    private final EventoRepository eventoRepository;
    private final ResolucionRepository resolucionRepository;

    @Override
    @Transactional
    public ItemEventoResponseDTO crearItemEvento(ItemEventoRequestDTO requestDTO) {
        ItemEvento item = new ItemEvento();
        mapToEntity(requestDTO, item);
        ItemEvento guardado = itemEventoRepository.save(item);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public ItemEventoResponseDTO actualizarItemEvento(Long id, ItemEventoRequestDTO requestDTO) {
        ItemEvento item = itemEventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ItemEvento no encontrado con ID: " + id));
        mapToEntity(requestDTO, item);
        ItemEvento actualizado = itemEventoRepository.save(item);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemEventoResponseDTO obtenerItemEvento(Long id) {
        ItemEvento item = itemEventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ItemEvento no encontrado con ID: " + id));
        return mapToDTO(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemEventoResponseDTO> obtenerTodos() {
        return itemEventoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemEventoResponseDTO> obtenerPorEvento(Long eventoId) {
        return itemEventoRepository.findByEventoId(eventoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarItemEvento(Long id) {
        if (!itemEventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("ItemEvento no encontrado con ID: " + id);
        }
        itemEventoRepository.deleteById(id);
    }

    private void mapToEntity(ItemEventoRequestDTO dto, ItemEvento entity) {
        Evento evento = eventoRepository.findById(dto.getEventoId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado con ID: " + dto.getEventoId()));
        entity.setEvento(evento);
        
        Resolucion resolucion = resolucionRepository.findById(dto.getResolucionId())
                .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + dto.getResolucionId()));
        entity.setResolucion(resolucion);
        
        entity.setDetalle(dto.getDetalle());
        entity.setUnidad(dto.getUnidad());
        entity.setCantidad(dto.getCantidad());
        entity.setValorUnitario(dto.getValorUnitario());
        
        // Calcular el valor total = cantidad * valor_unitario
        BigDecimal total = dto.getCantidad().multiply(dto.getValorUnitario());
        entity.setValorTotal(total);
        
        entity.setValorEjecutado(dto.getValorEjecutado());
        entity.setEstado(dto.getEstado());
    }

    private ItemEventoResponseDTO mapToDTO(ItemEvento entity) {
        ItemEventoResponseDTO dto = new ItemEventoResponseDTO();
        dto.setId(entity.getId());
        dto.setEventoId(entity.getEvento().getId());
        dto.setResolucionId(entity.getResolucion().getId());
        dto.setDetalle(entity.getDetalle());
        dto.setUnidad(entity.getUnidad());
        dto.setCantidad(entity.getCantidad());
        dto.setValorUnitario(entity.getValorUnitario());
        dto.setValorTotal(entity.getValorTotal());
        dto.setValorEjecutado(entity.getValorEjecutado());
        dto.setEstado(entity.getEstado());
        return dto;
    }
}
