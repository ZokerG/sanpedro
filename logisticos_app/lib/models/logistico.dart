class Logistico {
  final String id;
  final String nombre;
  final String documento;
  final String cargo;
  final String? avatarUrl;
  final String? codigoQr;
  final String? fotoPerfil;
  final String? tipoPersonal;

  const Logistico({
    required this.id,
    required this.nombre,
    required this.documento,
    required this.cargo,
    this.avatarUrl,
    this.codigoQr,
    this.fotoPerfil,
    this.tipoPersonal,
  });

  Logistico copyWith({String? fotoPerfil, String? tipoPersonal}) {
    return Logistico(
      id: id,
      nombre: nombre,
      documento: documento,
      cargo: cargo,
      avatarUrl: avatarUrl,
      codigoQr: codigoQr,
      fotoPerfil: fotoPerfil ?? this.fotoPerfil,
      tipoPersonal: tipoPersonal ?? this.tipoPersonal,
    );
  }
}
