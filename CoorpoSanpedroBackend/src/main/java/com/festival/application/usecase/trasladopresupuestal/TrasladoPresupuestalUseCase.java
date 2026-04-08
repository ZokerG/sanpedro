package com.festival.application.usecase.trasladopresupuestal;

import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalRequestDTO;
import com.festival.application.dto.trasladopresupuestal.TrasladoPresupuestalResponseDTO;

import java.util.List;

public interface TrasladoPresupuestalUseCase {
    TrasladoPresupuestalResponseDTO crearTraslado(TrasladoPresupuestalRequestDTO requestDTO);
    TrasladoPresupuestalResponseDTO actualizarTraslado(Long id, TrasladoPresupuestalRequestDTO requestDTO);
    TrasladoPresupuestalResponseDTO obtenerTraslado(Long id);
    List<TrasladoPresupuestalResponseDTO> obtenerTodos();
    List<TrasladoPresupuestalResponseDTO> obtenerPorFestival(Long festivalId);
    void eliminarTraslado(Long id);
}
