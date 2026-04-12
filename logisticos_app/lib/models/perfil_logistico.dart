class PerfilLogistico {
  final String id;
  final String nombreCompleto;
  final String? tipoDocumento;
  final String? numeroDocumento;
  final String? email;
  final String? telefono;
  final String? fechaNacimiento;
  final String? direccion;
  final String? arl;
  final String? tipoPersonal;
  final String? cargoNombre;
  final int? numeroCamiseta;
  final String? codigoQr;
  final bool activo;
  final String? bancoNombre;
  final String? tipoCuentaBancariaNombre;
  final String? numeroCuenta;

  /// Base64 con prefijo data URI: "data:image/jpeg;base64,..."
  final String? fotoPerfil;

  const PerfilLogistico({
    required this.id,
    required this.nombreCompleto,
    required this.activo,
    this.tipoDocumento,
    this.numeroDocumento,
    this.email,
    this.telefono,
    this.fechaNacimiento,
    this.direccion,
    this.arl,
    this.tipoPersonal,
    this.cargoNombre,
    this.numeroCamiseta,
    this.codigoQr,
    this.bancoNombre,
    this.tipoCuentaBancariaNombre,
    this.numeroCuenta,
    this.fotoPerfil,
  });

  factory PerfilLogistico.fromJson(Map<String, dynamic> j) {
    return PerfilLogistico(
      id: j['id'].toString(),
      nombreCompleto: j['nombreCompleto'] as String? ?? '',
      activo: j['activo'] as bool? ?? false,
      tipoDocumento: j['tipoDocumento'] as String?,
      numeroDocumento: j['numeroDocumento'] as String?,
      email: j['email'] as String?,
      telefono: j['telefono'] as String?,
      fechaNacimiento: j['fechaNacimiento'] as String?,
      direccion: j['direccion'] as String?,
      arl: j['arl'] as String?,
      tipoPersonal: j['tipoPersonal'] as String?,
      cargoNombre: j['cargoNombre'] as String?,
      numeroCamiseta: j['numeroCamiseta'] as int?,
      codigoQr: j['codigoQr'] as String?,
      bancoNombre: j['bancoNombre'] as String?,
      tipoCuentaBancariaNombre: j['tipoCuentaBancariaNombre'] as String?,
      numeroCuenta: j['numeroCuenta'] as String?,
      fotoPerfil: j['fotoPerfil'] as String?,
    );
  }
}
