package com.festival.application.usecase.personal;

import com.festival.application.dto.personal.PerfilResponseDTO;
import com.festival.application.dto.personal.PersonalRequestDTO;
import com.festival.application.dto.personal.PersonalResponseDTO;
import com.festival.entity.TipoPersonal;

import java.util.List;

public interface PersonalUseCase {
    PersonalResponseDTO crearPersonal(PersonalRequestDTO requestDTO);
    PersonalResponseDTO actualizarPersonal(Long id, PersonalRequestDTO requestDTO);
    PersonalResponseDTO obtenerPersonal(Long id);
    PerfilResponseDTO obtenerPerfil(Long id);
    List<PersonalResponseDTO> obtenerTodos();
    List<PersonalResponseDTO> obtenerPorTipo(TipoPersonal tipoPersonal);
    void desactivarPersonal(Long id);
    void eliminarPersonal(Long id);
}
