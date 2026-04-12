package com.festival.application.dto.documento;

import com.festival.entity.EstadoDocumento;
import com.festival.entity.TipoDocumentoRequerido;
import lombok.Data;

@Data
public class DocumentoPersonalDTO {
    private Long id;
    private Long personalId;
    private TipoDocumentoRequerido tipoDocumentoRequerido;
    private String nombreOriginalArchivo;
    private EstadoDocumento estado;
    private String notaRevision;
    private String presignedUrl; // Temporary URL to view/download the file
}
