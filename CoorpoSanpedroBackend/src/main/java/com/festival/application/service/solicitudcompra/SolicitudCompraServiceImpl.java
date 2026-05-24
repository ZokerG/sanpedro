package com.festival.application.service.solicitudcompra;

import com.festival.application.dto.solicitudcompra.SolicitudCompraRequestDTO;
import com.festival.application.dto.solicitudcompra.SolicitudCompraResponseDTO;
import com.festival.application.usecase.solicitudcompra.SolicitudCompraUseCase;
import com.festival.entity.*;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.persistence.repository.SolicitudCompraRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.s3.S3StorageService;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SolicitudCompraServiceImpl implements SolicitudCompraUseCase {

    private final SolicitudCompraRepository solicitudCompraRepository;
    private final PersonalRepository personalRepository;
    private final UsuarioRepository usuarioRepository;
    private final S3StorageService s3StorageService;

    @Override
    @Transactional
    public SolicitudCompraResponseDTO crearSolicitud(Long personalId, SolicitudCompraRequestDTO requestDTO, MultipartFile foto) {
        Personal personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + personalId));

        SolicitudCompra solicitud = new SolicitudCompra();
        solicitud.setPersonal(personal);
        solicitud.setMotivo(requestDTO.getMotivo());
        solicitud.setMonto(requestDTO.getMonto());
        solicitud.setCategoria(requestDTO.getCategoria());
        solicitud.setEstado(EstadoSolicitudCompra.PENDIENTE);

        if (foto != null && !foto.isEmpty()) {
            try {
                String objectKey = "solicitudes-compra/" + UUID.randomUUID() + "_" + foto.getOriginalFilename();
                solicitud.setFotoRuta(s3StorageService.uploadFile(objectKey, foto));
            } catch (IOException e) {
                throw new RuntimeException("Error al subir la foto del recibo", e);
            }
        }

        return toResponseDTO(solicitudCompraRepository.save(solicitud));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudCompraResponseDTO> obtenerTodas() {
        return solicitudCompraRepository.findAllWithPersonal().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudCompraResponseDTO> obtenerPendientes() {
        return solicitudCompraRepository.findByEstadoOrderByCreatedAtDesc(EstadoSolicitudCompra.PENDIENTE).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SolicitudCompraResponseDTO> obtenerPorPersonal(Long personalId) {
        return solicitudCompraRepository.findByPersonalIdOrderByCreatedAtDesc(personalId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SolicitudCompraResponseDTO obtenerPorId(Long id) {
        return solicitudCompraRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de compra no encontrada con ID: " + id));
    }

    @Override
    @Transactional
    public SolicitudCompraResponseDTO aprobar(Long id, Long aprobadorId) {
        SolicitudCompra solicitud = solicitudCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de compra no encontrada con ID: " + id));

        if (solicitud.getEstado() != EstadoSolicitudCompra.PENDIENTE) {
            throw new IllegalStateException("La solicitud ya fue resuelta (estado: " + solicitud.getEstado() + ")");
        }

        Usuario aprobador = usuarioRepository.findById(aprobadorId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario aprobador no encontrado con ID: " + aprobadorId));

        solicitud.setEstado(EstadoSolicitudCompra.APROBADA);
        solicitud.setAprobador(aprobador);
        solicitud.setFechaAprobacion(LocalDateTime.now());

        return toResponseDTO(solicitudCompraRepository.save(solicitud));
    }

    @Override
    @Transactional
    public SolicitudCompraResponseDTO rechazar(Long id, String notaRechazo) {
        SolicitudCompra solicitud = solicitudCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de compra no encontrada con ID: " + id));

        if (solicitud.getEstado() != EstadoSolicitudCompra.PENDIENTE) {
            throw new IllegalStateException("La solicitud ya fue resuelta (estado: " + solicitud.getEstado() + ")");
        }

        solicitud.setEstado(EstadoSolicitudCompra.RECHAZADA);
        solicitud.setNotaRechazo(notaRechazo);

        return toResponseDTO(solicitudCompraRepository.save(solicitud));
    }

    @Override
    @Transactional
    public SolicitudCompraResponseDTO registrarTransferencia(Long id, MultipartFile comprobante) {
        SolicitudCompra solicitud = solicitudCompraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de compra no encontrada con ID: " + id));

        if (solicitud.getEstado() != EstadoSolicitudCompra.APROBADA) {
            throw new IllegalStateException("Solo se puede registrar transferencia en solicitudes aprobadas (estado: " + solicitud.getEstado() + ")");
        }

        if (comprobante != null && !comprobante.isEmpty()) {
            try {
                String objectKey = "comprobantes-transferencia/" + UUID.randomUUID() + "_" + comprobante.getOriginalFilename();
                solicitud.setComprobanteTransferenciaRuta(s3StorageService.uploadFile(objectKey, comprobante));
            } catch (IOException e) {
                throw new RuntimeException("Error al subir el comprobante de transferencia", e);
            }
        }

        solicitud.setFechaTransferencia(LocalDateTime.now());

        return toResponseDTO(solicitudCompraRepository.save(solicitud));
    }

    private SolicitudCompraResponseDTO toResponseDTO(SolicitudCompra s) {
        SolicitudCompraResponseDTO dto = new SolicitudCompraResponseDTO();
        dto.setId(s.getId());
        dto.setPersonalId(s.getPersonal().getId());
        dto.setPersonalNombre(s.getPersonal().getNombreCompleto());
        dto.setMotivo(s.getMotivo());
        dto.setMonto(s.getMonto());
        dto.setCategoria(s.getCategoria());
        dto.setFotoPresignedUrl(s3StorageService.getPresignedUrl(s.getFotoRuta()));
        dto.setEstado(s.getEstado());
        if (s.getAprobador() != null) {
            dto.setAprobadorId(s.getAprobador().getId());
            dto.setAprobadorNombre(s.getAprobador().getNombre() + " " + s.getAprobador().getApellido());
        }
        dto.setFechaAprobacion(s.getFechaAprobacion());
        dto.setComprobanteTransferenciaPresignedUrl(s3StorageService.getPresignedUrl(s.getComprobanteTransferenciaRuta()));
        dto.setFechaTransferencia(s.getFechaTransferencia());
        dto.setNotaRechazo(s.getNotaRechazo());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
