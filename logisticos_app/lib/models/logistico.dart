class Logistico {
  final String id;
  final String nombre;
  final String documento;
  final String cargo;
  final String? avatarUrl;
  final String? codigoQr;

  const Logistico({
    required this.id,
    required this.nombre,
    required this.documento,
    required this.cargo,
    this.avatarUrl,
    this.codigoQr,
  });
}
