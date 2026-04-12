package com.festival.application.usecase.tipocuenta;

import com.festival.application.dto.tipocuenta.TipoCuentaBancariaDTO;
import com.festival.application.dto.tipocuenta.TipoCuentaBancariaRequestDTO;

import java.util.List;

public interface TipoCuentaBancariaUseCase {
    TipoCuentaBancariaDTO crearTipoCuenta(TipoCuentaBancariaRequestDTO requestDTO);
    TipoCuentaBancariaDTO actualizarTipoCuenta(Long id, TipoCuentaBancariaRequestDTO requestDTO);
    TipoCuentaBancariaDTO obtenerTipoCuenta(Long id);
    List<TipoCuentaBancariaDTO> obtenerTodos();
    List<TipoCuentaBancariaDTO> obtenerActivos();
    void toggleActivo(Long id);
    void eliminarTipoCuenta(Long id);
}
