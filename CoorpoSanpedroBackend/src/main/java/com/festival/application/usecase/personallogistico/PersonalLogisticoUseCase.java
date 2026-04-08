package com.festival.application.usecase.personallogistico;

import com.festival.application.dto.personallogistico.PersonalLogisticoRequestDTO;
import com.festival.application.dto.personallogistico.PersonalLogisticoResponseDTO;

import java.util.List;

public interface PersonalLogisticoUseCase {

    PersonalLogisticoResponseDTO crear(PersonalLogisticoRequestDTO requestDTO);

    PersonalLogisticoResponseDTO actualizar(Long id, PersonalLogisticoRequestDTO requestDTO);

    PersonalLogisticoResponseDTO obtenerPorId(Long id);

    List<PersonalLogisticoResponseDTO> listarTodos();

    List<PersonalLogisticoResponseDTO> listarActivos();

    void desactivar(Long id);

    void eliminar(Long id);
}
