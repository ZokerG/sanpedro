enum EstadoDocumento { pendiente, verificado, rechazado }

enum TipoDocumentoRequerido {
  cedula,
  rut,
  certificadoBancario,
  contratoFirmado,
  fotoPerfil,
}

extension TipoDocumentoLabel on TipoDocumentoRequerido {
  String get label {
    switch (this) {
      case TipoDocumentoRequerido.cedula:
        return 'Cédula de Ciudadanía';
      case TipoDocumentoRequerido.rut:
        return 'RUT';
      case TipoDocumentoRequerido.certificadoBancario:
        return 'Certificación Bancaria';
      case TipoDocumentoRequerido.contratoFirmado:
        return 'Contrato Firmado';
      case TipoDocumentoRequerido.fotoPerfil:
        return 'Foto para Carné';
    }
  }

  String get apiValue {
    switch (this) {
      case TipoDocumentoRequerido.cedula:
        return 'CEDULA';
      case TipoDocumentoRequerido.rut:
        return 'RUT';
      case TipoDocumentoRequerido.certificadoBancario:
        return 'CERTIFICADO_BANCARIO';
      case TipoDocumentoRequerido.contratoFirmado:
        return 'CONTRATO_FIRMADO';
      case TipoDocumentoRequerido.fotoPerfil:
        return 'FOTO_PERFIL';
    }
  }
}

class DocumentoPersonal {
  final int id;
  final int personalId;
  final TipoDocumentoRequerido tipo;
  final String nombreArchivo;
  final EstadoDocumento estado;
  final String? notaRevision;
  final String? presignedUrl;

  const DocumentoPersonal({
    required this.id,
    required this.personalId,
    required this.tipo,
    required this.nombreArchivo,
    required this.estado,
    this.notaRevision,
    this.presignedUrl,
  });

  bool get bloqueado => estado == EstadoDocumento.verificado;

  factory DocumentoPersonal.fromJson(Map<String, dynamic> j) {
    final tipoStr = j['tipoDocumentoRequerido'] as String? ?? '';
    final estadoStr = (j['estado'] as String? ?? '').toUpperCase();

    return DocumentoPersonal(
      id: j['id'] as int,
      personalId: j['personalId'] as int,
      tipo: _parseTipo(tipoStr),
      nombreArchivo: j['nombreOriginalArchivo'] as String? ?? '',
      estado: _parseEstado(estadoStr),
      notaRevision: j['notaRevision'] as String?,
      presignedUrl: j['presignedUrl'] as String?,
    );
  }

  static TipoDocumentoRequerido _parseTipo(String s) {
    switch (s) {
      case 'RUT':
        return TipoDocumentoRequerido.rut;
      case 'CERTIFICADO_BANCARIO':
        return TipoDocumentoRequerido.certificadoBancario;
      case 'CONTRATO_FIRMADO':
        return TipoDocumentoRequerido.contratoFirmado;
      case 'FOTO_PERFIL':
        return TipoDocumentoRequerido.fotoPerfil;
      default:
        return TipoDocumentoRequerido.cedula;
    }
  }

  static EstadoDocumento _parseEstado(String s) {
    switch (s) {
      case 'VERIFICADO':
        return EstadoDocumento.verificado;
      case 'RECHAZADO':
        return EstadoDocumento.rechazado;
      default:
        return EstadoDocumento.pendiente;
    }
  }
}
