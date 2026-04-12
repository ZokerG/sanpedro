package com.festival.application.service.documento;

import com.festival.application.dto.documento.DocumentoPersonalDTO;
import com.festival.entity.EstadoDocumento;
import com.festival.entity.TipoDocumentoRequerido;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentoPersonalService {
    
    DocumentoPersonalDTO uploadDocumento(Long personalId, TipoDocumentoRequerido tipo, MultipartFile file);
    
    List<DocumentoPersonalDTO> getDocumentosByPersonal(Long personalId);
    
    DocumentoPersonalDTO updateEstado(Long id, EstadoDocumento estado, String notaRevision);
    
    void deleteDocumento(Long id);
}
