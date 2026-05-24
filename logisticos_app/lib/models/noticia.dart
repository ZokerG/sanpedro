class Noticia {
  final int id;
  final String autorNombre;
  final String titulo;
  final String contenido;
  final String? planta;
  final bool destacada;
  final String fechaPublicacion;
  final String? imagenPresignedUrl;
  final String? createdAt;

  const Noticia({
    required this.id,
    required this.autorNombre,
    required this.titulo,
    required this.contenido,
    this.planta,
    required this.destacada,
    required this.fechaPublicacion,
    this.imagenPresignedUrl,
    this.createdAt,
  });

  factory Noticia.fromJson(Map<String, dynamic> json) {
    return Noticia(
      id: json['id'],
      autorNombre: json['autorNombre'] ?? '',
      titulo: json['titulo'] ?? '',
      contenido: json['contenido'] ?? '',
      planta: json['planta'],
      destacada: json['destacada'] ?? false,
      fechaPublicacion: json['fechaPublicacion'] ?? '',
      imagenPresignedUrl: json['imagenPresignedUrl'],
      createdAt: json['createdAt'],
    );
  }
}
