package com.festival.application.service.cartera;

import com.festival.application.dto.cartera.CarteraLogisticoDTO;
import com.festival.application.dto.cartera.CarteraResumenDTO;
import com.festival.application.usecase.cartera.CarteraUseCase;
import com.festival.entity.CarteraLogistico;
import com.festival.entity.EstadoCartera;
import com.festival.infrastructure.persistence.repository.CarteraLogisticoRepository;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarteraServiceImpl implements CarteraUseCase {

    private final CarteraLogisticoRepository carteraRepository;
    private final PersonalRepository personalRepository;

    @Override
    @Transactional(readOnly = true)
    public CarteraResumenDTO obtenerCarteraPersonal(Long personalId) {
        var personal = personalRepository.findById(personalId)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + personalId));

        List<CarteraLogisticoDTO> registros = carteraRepository
                .findByPersonalIdOrderByFechaLiquidacionDesc(personalId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        CarteraResumenDTO resumen = new CarteraResumenDTO();
        resumen.setPersonalId(personalId);
        resumen.setNombrePersonal(personal.getNombreCompleto());
        resumen.setTotalPendiente(carteraRepository.sumMontoPendienteByPersonalId(personalId));
        resumen.setRegistros(registros);
        return resumen;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarteraLogisticoDTO> obtenerCarterasPendientes() {
        return carteraRepository.findByEstadoOrderByFechaLiquidacionDesc(EstadoCartera.PENDIENTE_COBRO)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private CarteraLogisticoDTO mapToDTO(CarteraLogistico c) {
        CarteraLogisticoDTO dto = new CarteraLogisticoDTO();
        dto.setId(c.getId());
        dto.setPersonalId(c.getPersonal().getId());
        dto.setEventoId(c.getEvento().getId());
        dto.setNombreEvento(c.getEvento().getNombre());
        dto.setUbicacionEvento(c.getEvento().getUbicacionLogistica());
        dto.setMonto(c.getMonto());
        dto.setFechaLiquidacion(c.getFechaLiquidacion());
        dto.setEstado(c.getEstado().name());
        dto.setNota(c.getNota());
        return dto;
    }
}
