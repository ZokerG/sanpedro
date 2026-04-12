package com.festival.application.usecase.cartera;

import com.festival.application.dto.cartera.CarteraLogisticoDTO;
import com.festival.application.dto.cartera.CarteraResumenDTO;

import java.util.List;

public interface CarteraUseCase {

    /** Resumen de cartera de un logístico: total pendiente + detalle por evento. */
    CarteraResumenDTO obtenerCarteraPersonal(Long personalId);

    /** Lista todas las carteras pendientes (vista admin). */
    List<CarteraLogisticoDTO> obtenerCarterasPendientes();
}
