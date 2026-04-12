package com.festival.application.mapper;

import com.festival.application.dto.tipocuenta.TipoCuentaBancariaDTO;
import com.festival.application.dto.tipocuenta.TipoCuentaBancariaRequestDTO;
import com.festival.entity.TipoCuentaBancaria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TipoCuentaBancariaMapper {

    TipoCuentaBancariaDTO toDTO(TipoCuentaBancaria entity);
    List<TipoCuentaBancariaDTO> toDTOs(List<TipoCuentaBancaria> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TipoCuentaBancaria toEntity(TipoCuentaBancariaRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "activo", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(TipoCuentaBancariaRequestDTO requestDTO, @MappingTarget TipoCuentaBancaria entity);
}
