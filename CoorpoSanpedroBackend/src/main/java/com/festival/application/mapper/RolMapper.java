package com.festival.application.mapper;

import com.festival.application.dto.rol.RolDTO;
import com.festival.application.dto.rol.RolRequestDTO;
import com.festival.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RolMapper {

    RolDTO toDTO(Rol rol);
    List<RolDTO> toDTOs(List<Rol> roles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Rol toEntity(RolRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(RolRequestDTO requestDTO, @MappingTarget Rol entity);
}
