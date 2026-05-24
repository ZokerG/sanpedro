package com.festival.application.dto.solicitudcompra;

import com.festival.entity.CategoriaCompra;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SolicitudCompraRequestDTO {

    @NotBlank(message = "El motivo es obligatorio")
    private String motivo;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @NotNull(message = "La categoría es obligatoria")
    private CategoriaCompra categoria;
}
