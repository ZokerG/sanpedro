package com.festival.application.usecase.banco;

import com.festival.application.dto.banco.BancoDTO;
import com.festival.application.dto.banco.BancoRequestDTO;

import java.util.List;

public interface BancoUseCase {
    BancoDTO crearBanco(BancoRequestDTO requestDTO);
    BancoDTO actualizarBanco(Long id, BancoRequestDTO requestDTO);
    BancoDTO obtenerBanco(Long id);
    List<BancoDTO> obtenerTodos();
    List<BancoDTO> obtenerActivos();
    void toggleActivo(Long id);
    void eliminarBanco(Long id);
}
