package com.festival.application.service.documento;

import com.festival.application.dto.documento.DocumentoPersonalDTO;
import com.festival.application.dto.documento.DocumentoPersonalMapper;
import com.festival.application.service.personal.PersonalServiceImpl;
import com.festival.entity.DocumentoPersonal;
import com.festival.entity.EstadoDocumento;
import com.festival.entity.Personal;
import com.festival.entity.TipoDocumentoRequerido;
import com.festival.infrastructure.persistence.repository.DocumentoPersonalRepository;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.s3.S3StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentoPersonalServiceImpl implements DocumentoPersonalService {

    private final DocumentoPersonalRepository documentoPersonalRepository;
    private final PersonalRepository personalRepository;
    private final DocumentoPersonalMapper mapper;
    private final S3StorageService s3StorageService;

    @Override
    @Transactional
    public DocumentoPersonalDTO uploadDocumento(Long personalId, TipoDocumentoRequerido tipo, MultipartFile file) {
        Personal personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado"));

        try {
            // Generate unique S3 Key
            String extension = getFileExtension(file.getOriginalFilename());
            String objectKey = "personal/" + personalId + "/" + tipo.name() + "_" + UUID.randomUUID() + extension;

            // Upload to S3
            String uploadedKey = s3StorageService.uploadFile(objectKey, file);

            // Create or update record
            DocumentoPersonal documento = documentoPersonalRepository
                    .findByPersonalIdAndTipoDocumentoRequerido(personalId, tipo)
                    .orElse(new DocumentoPersonal());

            // If replacing, we could theoretically delete the old object from S3 here to save space
            if (documento.getRutaArchivo() != null) {
                try {
                    s3StorageService.deleteFile(documento.getRutaArchivo());
                } catch (Exception e) {
                    // Ignore delete errors to ensure atomic upload success
                }
            }

            documento.setPersonal(personal);
            documento.setTipoDocumentoRequerido(tipo);
            documento.setRutaArchivo(uploadedKey);
            documento.setNombreOriginalArchivo(file.getOriginalFilename());
            documento.setEstado(EstadoDocumento.PENDIENTE); // Always resets to pendiente on new upload
            documento.setNotaRevision(null);

            documento = documentoPersonalRepository.save(documento);
            return populatePresignedUrl(documento);

        } catch (IOException e) {
            throw new RuntimeException("Error al subir archivo a S3", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoPersonalDTO> getDocumentosByPersonal(Long personalId) {
        return documentoPersonalRepository.findByPersonalId(personalId).stream()
                .map(this::populatePresignedUrl)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DocumentoPersonalDTO updateEstado(Long id, EstadoDocumento estado, String notaRevision) {
        DocumentoPersonal documento = documentoPersonalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        documento.setEstado(estado);
        documento.setNotaRevision(notaRevision);

        return populatePresignedUrl(documentoPersonalRepository.save(documento));
    }

    @Override
    @Transactional
    public void deleteDocumento(Long id) {
        DocumentoPersonal documento = documentoPersonalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        try {
            s3StorageService.deleteFile(documento.getRutaArchivo());
        } catch (Exception e) {
            // Log but don't fail, best effort
        }

        documentoPersonalRepository.delete(documento);
    }

    private DocumentoPersonalDTO populatePresignedUrl(DocumentoPersonal doc) {
        DocumentoPersonalDTO dto = mapper.toDto(doc);
        dto.setPresignedUrl(s3StorageService.getPresignedUrl(doc.getRutaArchivo()));
        return dto;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
