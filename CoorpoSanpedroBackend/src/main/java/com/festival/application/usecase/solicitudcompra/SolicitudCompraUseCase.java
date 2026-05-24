package com.festival.application.usecase.solicitudcompra;

import com.festival.application.dto.solicitudcompra.SolicitudCompraRequestDTO;
import com.festival.application.dto.solicitudcompra.SolicitudCompraResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SolicitudCompraUseCase {

    SolicitudCompraResponseDTO crearSolicitud(Long personalId, SolicitudCompraRequestDTO requestDTO, MultipartFile foto);

    List<SolicitudCompraResponseDTO> obtenerTodas();

    List<SolicitudCompraResponseDTO> obtenerPendientes();

    List<SolicitudCompraResponseDTO> obtenerPorPersonal(Long personalId);

    SolicitudCompraResponseDTO obtenerPorId(Long id);

    SolicitudCompraResponseDTO aprobar(Long id, Long aprobadorId);

    SolicitudCompraResponseDTO rechazar(Long id, String notaRechazo);

    SolicitudCompraResponseDTO registrarTransferencia(Long id, MultipartFile comprobante);
}
