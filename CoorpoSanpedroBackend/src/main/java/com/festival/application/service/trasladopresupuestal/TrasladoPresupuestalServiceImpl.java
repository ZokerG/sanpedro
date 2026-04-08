package com.festival.application.service.trasladopresupuestal;

import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalRequestDTO;
import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalResponseDTO;
import com.festival.application.usecase.trasladopresupuestal.TrasladoPresupuestalUseCase;
import com.festival.entity.Festival;
import com.festival.entity.Resolucion;
import com.festival.entity.TrasladoPresupuestal;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.ResolucionRepository;
import com.festival.infrastructure.persistence.repository.TrasladoPresupuestalRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrasladoPresupuestalServiceImpl implements TrasladoPresupuestalUseCase {

    private final TrasladoPresupuestalRepository trasladoRepository;
    private final FestivalRepository festivalRepository;
    private final ResolucionRepository resolucionRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public TrasladoPresupuestalResponseDTO crearTraslado(TrasladoPresupuestalRequestDTO requestDTO) {
        TrasladoPresupuestal traslado = new TrasladoPresupuestal();
        mapToEntity(requestDTO, traslado);
        TrasladoPresupuestal guardado = trasladoRepository.save(traslado);
        return mapToDTO(guardado);
    }

    @Override
    @Transactional
    public TrasladoPresupuestalResponseDTO actualizarTraslado(Long id, TrasladoPresupuestalRequestDTO requestDTO) {
        TrasladoPresupuestal traslado = trasladoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Traslado presupuestal no encontrado con ID: " + id));
        mapToEntity(requestDTO, traslado);
        TrasladoPresupuestal actualizado = trasladoRepository.save(traslado);
        return mapToDTO(actualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public TrasladoPresupuestalResponseDTO obtenerTraslado(Long id) {
        TrasladoPresupuestal traslado = trasladoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Traslado presupuestal no encontrado con ID: " + id));
        return mapToDTO(traslado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrasladoPresupuestalResponseDTO> obtenerTodos() {
        return trasladoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrasladoPresupuestalResponseDTO> obtenerPorFestival(Long festivalId) {
        return trasladoRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarTraslado(Long id) {
        if (!trasladoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Traslado presupuestal no encontrado con ID: " + id);
        }
        trasladoRepository.deleteById(id);
    }

    private void mapToEntity(TrasladoPresupuestalRequestDTO dto, TrasladoPresupuestal entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        if (dto.getResolucionRespaldoId() != null) {
            Resolucion resolucion = resolucionRepository.findById(dto.getResolucionRespaldoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resolución no encontrada con ID: " + dto.getResolucionRespaldoId()));
            entity.setResolucionRespaldo(resolucion);
        } else {
            entity.setResolucionRespaldo(null);
        }
        
        entity.setTipoOrigen(dto.getTipoOrigen());
        entity.setIdOrigen(dto.getIdOrigen());
        entity.setTipoDestino(dto.getTipoDestino());
        entity.setIdDestino(dto.getIdDestino());
        entity.setValor(dto.getValor());
        entity.setJustificacion(dto.getJustificacion());
        entity.setEstado(dto.getEstado());

        if (dto.getAprobadoPorId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getAprobadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + dto.getAprobadoPorId()));
            entity.setAprobadoPor(usuario);
        } else {
            entity.setAprobadoPor(null);
        }
    }

    private TrasladoPresupuestalResponseDTO mapToDTO(TrasladoPresupuestal entity) {
        TrasladoPresupuestalResponseDTO dto = new TrasladoPresupuestalResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        
        if (entity.getResolucionRespaldo() != null) {
            dto.setResolucionRespaldoId(entity.getResolucionRespaldo().getId());
        }
        
        dto.setTipoOrigen(entity.getTipoOrigen());
        dto.setIdOrigen(entity.getIdOrigen());
        dto.setTipoDestino(entity.getTipoDestino());
        dto.setIdDestino(entity.getIdDestino());
        dto.setValor(entity.getValor());
        dto.setJustificacion(entity.getJustificacion());
        dto.setEstado(entity.getEstado());
        
        if (entity.getAprobadoPor() != null) {
            dto.setAprobadoPorId(entity.getAprobadoPor().getId());
            dto.setAprobadoPorNombre(entity.getAprobadoPor().getNombre() + " " + entity.getAprobadoPor().getApellido());
        }
        return dto;
    }
}
