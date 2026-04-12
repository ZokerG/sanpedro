class Logistico {
  final String id;
  final String nombre;
  final String documento;
  final String cargo;
  final String? avatarUrl;
  final String? codigoQr;
  final String? fotoPerfil;

  const Logistico({
    required this.id,
    required this.nombre,
    required this.documento,
    required this.cargo,
    this.avatarUrl,
    this.codigoQr,
    this.fotoPerfil,
  });

  Logistico copyWith({String? fotoPerfil}) {
    return Logistico(
      id: id,
      nombre: nombre,
      documento: documento,
      cargo: cargo,
      avatarUrl: avatarUrl,
      codigoQr: codigoQr,
      fotoPerfil: fotoPerfil ?? this.fotoPerfil,
    );
  }
}
