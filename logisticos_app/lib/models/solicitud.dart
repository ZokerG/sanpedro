enum EstadoSolicitud { pendiente, aprobada, rechazada, cancelada }

extension EstadoSolicitudLabel on EstadoSolicitud {
  String get label {
    switch (this) {
      case EstadoSolicitud.pendiente:
        return 'Pendiente';
      case EstadoSolicitud.aprobada:
        return 'Aprobada';
      case EstadoSolicitud.rechazada:
        return 'Rechazada';
      case EstadoSolicitud.cancelada:
        return 'Cancelada';
    }
  }
}

class Solicitud {
  final int id;
  final int eventoId;
  final String eventoNombre;
  final EstadoSolicitud estado;
  final DateTime fechaSolicitud;
  final String? notaRechazo;
  final String? rolAsignado;

  const Solicitud({
    required this.id,
    required this.eventoId,
    required this.eventoNombre,
    required this.estado,
    required this.fechaSolicitud,
    this.notaRechazo,
    this.rolAsignado,
  });
}
