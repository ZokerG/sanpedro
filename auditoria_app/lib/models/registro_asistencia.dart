class RegistroAsistencia {
  final int id;
  final int personalId;
  final String nombrePersonal;
  final String documento;
  final int? numeroCamiseta;
  final String tipo; // INGRESO | SALIDA
  final DateTime timestampRegistro;
  final String? registradoPor;

  const RegistroAsistencia({
    required this.id,
    required this.personalId,
    required this.nombrePersonal,
    required this.documento,
    this.numeroCamiseta,
    required this.tipo,
    required this.timestampRegistro,
    this.registradoPor,
  });

  factory RegistroAsistencia.fromJson(Map<String, dynamic> j) {
    return RegistroAsistencia(
      id: j['id'] as int,
      personalId: j['personalId'] as int,
      nombrePersonal: j['nombrePersonal'] as String? ?? '',
      documento: j['documento'] as String? ?? '',
      numeroCamiseta: j['numeroCamiseta'] as int?,
      tipo: j['tipo'] as String? ?? '',
      timestampRegistro: DateTime.parse(j['timestampRegistro'] as String),
      registradoPor: j['registradoPor'] as String?,
    );
  }

  bool get esIngreso => tipo.toUpperCase() == 'INGRESO';
}
