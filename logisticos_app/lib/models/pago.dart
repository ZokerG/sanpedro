enum EstadoPago { pendiente, enLiquidacion, pagado }

extension EstadoPagoLabel on EstadoPago {
  String get label {
    switch (this) {
      case EstadoPago.pendiente:
        return 'Pendiente';
      case EstadoPago.enLiquidacion:
        return 'En liquidación';
      case EstadoPago.pagado:
        return 'Pagado';
    }
  }
}

class Pago {
  final String eventoId;
  final String eventoNombre;
  final DateTime fechaEvento;
  final double monto;
  final EstadoPago estado;
  final bool cuentaGenerada;

  const Pago({
    required this.eventoId,
    required this.eventoNombre,
    required this.fechaEvento,
    required this.monto,
    required this.estado,
    this.cuentaGenerada = false,
  });
}
