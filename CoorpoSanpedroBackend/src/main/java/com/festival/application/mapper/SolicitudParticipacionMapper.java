package com.festival.application.mapper;

import com.festival.application.dto.solicitud.SolicitudParticipacionDTO;
import com.festival.entity.SolicitudParticipacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SolicitudParticipacionMapper {

    @Mapping(target = "personalId", source = "personal.id")
    @Mapping(target = "personalNombre", expression = "java(entity.getPersonal().getNombreCompleto())")
    @Mapping(target = "personalDocumento", source = "personal.numeroDocumento")
    @Mapping(target = "eventoId", source = "evento.id")
    @Mapping(target = "eventoNombre", source = "evento.nombre")
    @Mapping(target = "asignacionId", source = "asignacion.id")
    SolicitudParticipacionDTO toDTO(SolicitudParticipacion entity);

    List<SolicitudParticipacionDTO> toDTOs(List<SolicitudParticipacion> entities);
}
