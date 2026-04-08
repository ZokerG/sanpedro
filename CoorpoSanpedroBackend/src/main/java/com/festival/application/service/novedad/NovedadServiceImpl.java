package com.festival.application.service.novedad;

import com.festival.application.dto.novedad.NovedadRequestDTO;
import com.festival.application.dto.novedad.NovedadResponseDTO;
import com.festival.application.usecase.novedad.NovedadUseCase;
import com.festival.entity.EntidadNovedad;
import com.festival.entity.Festival;
import com.festival.entity.Novedad;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.FestivalRepository;
import com.festival.infrastructure.persistence.repository.NovedadRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NovedadServiceImpl implements NovedadUseCase {

    private final NovedadRepository novedadRepository;
    private final FestivalRepository festivalRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public NovedadResponseDTO crearNovedad(NovedadRequestDTO requestDTO) {
        Novedad novedad = new Novedad();
        mapToEntity(requestDTO, novedad);
        Novedad guardada = novedadRepository.save(novedad);
        return mapToDTO(guardada);
    }

    @Override
    @Transactional
    public NovedadResponseDTO actualizarNovedad(Long id, NovedadRequestDTO requestDTO) {
        Novedad novedad = novedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));
        mapToEntity(requestDTO, novedad);
        Novedad actualizada = novedadRepository.save(novedad);
        return mapToDTO(actualizada);
    }

    @Override
    @Transactional(readOnly = true)
    public NovedadResponseDTO obtenerNovedad(Long id) {
        Novedad novedad = novedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));
        return mapToDTO(novedad);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NovedadResponseDTO> obtenerTodos() {
        return novedadRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NovedadResponseDTO> obtenerPorFestival(Long festivalId) {
        return novedadRepository.findByFestivalId(festivalId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NovedadResponseDTO> obtenerPorEntidad(EntidadNovedad tipoEntidad, Long entidadId) {
        return novedadRepository.findByTipoEntidadAndEntidadId(tipoEntidad, entidadId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarNovedad(Long id) {
        if (!novedadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Novedad no encontrada con ID: " + id);
        }
        novedadRepository.deleteById(id);
    }

    private void mapToEntity(NovedadRequestDTO dto, Novedad entity) {
        Festival festival = festivalRepository.findById(dto.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival no encontrado con ID: " + dto.getFestivalId()));
        entity.setFestival(festival);
        
        Usuario usuario = usuarioRepository.findById(dto.getRegistradoPorId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + dto.getRegistradoPorId()));
        entity.setRegistradoPor(usuario);

        entity.setTipoEntidad(dto.getTipoEntidad());
        entity.setEntidadId(dto.getEntidadId());
        entity.setDescripcion(dto.getDescripcion());
    }

    private NovedadResponseDTO mapToDTO(Novedad entity) {
        NovedadResponseDTO dto = new NovedadResponseDTO();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival().getId());
        dto.setTipoEntidad(entity.getTipoEntidad());
        dto.setEntidadId(entity.getEntidadId());
        dto.setDescripcion(entity.getDescripcion());
        dto.setRegistradoPorId(entity.getRegistradoPor().getId());
        dto.setRegistradoPorNombre(entity.getRegistradoPor().getNombre() + " " + entity.getRegistradoPor().getApellido());
        return dto;
    }
}
