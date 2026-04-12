class EventoResumen {
  final int id;
  final String nombre;
  final String estado;
  final DateTime fechaInicio;
  final String? ubicacion;
  final int? limitePersonal;
  final int totalAsignados;

  const EventoResumen({
    required this.id,
    required this.nombre,
    required this.estado,
    required this.fechaInicio,
    this.ubicacion,
    this.limitePersonal,
    required this.totalAsignados,
  });

  factory EventoResumen.fromJson(Map<String, dynamic> j) {
    return EventoResumen(
      id: j['id'] as int,
      nombre: j['nombre'] as String,
      estado: j['estado'] as String? ?? '',
      fechaInicio: DateTime.parse(j['fechaInicio'] as String),
      ubicacion: j['ubicacionLogistica'] as String?,
      limitePersonal: j['limitePersonal'] as int?,
      totalAsignados: j['totalAsignados'] as int? ?? 0,
    );
  }

  bool get esActivo {
    final s = estado.toUpperCase();
    return s == 'EN_PREPARACION' || s == 'EN_CURSO' || s == 'PLANEADO';
  }
}
