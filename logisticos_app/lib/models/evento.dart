enum EstadoEvento { proximo, enCurso, liquidacion, finalizado }

extension EstadoEventoLabel on EstadoEvento {
  String get label {
    switch (this) {
      case EstadoEvento.proximo:
        return 'Próximo';
      case EstadoEvento.enCurso:
        return 'En curso';
      case EstadoEvento.liquidacion:
        return 'Liquidación';
      case EstadoEvento.finalizado:
        return 'Finalizado';
    }
  }
}

class Evento {
  final String id;
  final String nombre;
  final DateTime fecha;
  final String horaInicio;
  final String ubicacion;
  final double tarifa;
  final EstadoEvento estado;
  final String? horaIngresoRegistrado;
  final String? horaSalidaRegistrada;
  final bool cuentaGenerada;

  const Evento({
    required this.id,
    required this.nombre,
    required this.fecha,
    required this.horaInicio,
    required this.ubicacion,
    required this.tarifa,
    required this.estado,
    this.horaIngresoRegistrado,
    this.horaSalidaRegistrada,
    this.cuentaGenerada = false,
  });
}
