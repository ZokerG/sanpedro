package com.festival.application.mapper;

import com.festival.application.dto.usuario.UsuarioRequestDTO;
import com.festival.application.dto.usuario.UsuarioResponseDTO;
import com.festival.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UsuarioMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", ignore = true)
    Usuario toEntity(UsuarioRequestDTO requestDTO);

    UsuarioResponseDTO toResponseDTO(Usuario usuario);
}
