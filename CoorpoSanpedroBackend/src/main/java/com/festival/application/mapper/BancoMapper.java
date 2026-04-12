package com.festival.application.mapper;

import com.festival.application.dto.banco.BancoDTO;
import com.festival.application.dto.banco.BancoRequestDTO;
import com.festival.entity.Banco;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BancoMapper {

    BancoDTO toDTO(Banco banco);
    List<BancoDTO> toDTOs(List<Banco> bancos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Banco toEntity(BancoRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(BancoRequestDTO requestDTO, @MappingTarget Banco entity);
}
