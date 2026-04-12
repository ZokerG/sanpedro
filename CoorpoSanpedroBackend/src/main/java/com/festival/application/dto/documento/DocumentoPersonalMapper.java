package com.festival.application.dto.documento;

import com.festival.entity.DocumentoPersonal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DocumentoPersonalMapper {
    @Mapping(target = "personalId", source = "personal.id")
    @Mapping(target = "presignedUrl", ignore = true) // Set manually by service
    DocumentoPersonalDTO toDto(DocumentoPersonal entity);
}
