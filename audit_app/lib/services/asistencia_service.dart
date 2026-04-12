import 'api_client.dart';
import '../models/registro_asistencia.dart';

enum ResultadoEscaneo { ingreso, salida, rechazado }

class ResultadoScan {
  final ResultadoEscaneo resultado;
  final String mensaje;
  final String? nombrePersonal;
  final String? documento;
  final int? numeroCamiseta;
  final String? rolAsignado;

  const ResultadoScan({
    required this.resultado,
    required this.mensaje,
    this.nombrePersonal,
    this.documento,
    this.numeroCamiseta,
    this.rolAsignado,
  });
}

class AsistenciaService {
  final ApiClient _api;
  AsistenciaService(this._api);

  /// Procesa el escaneo de un QR para un evento específico.
  Future<ResultadoScan> escanear({
    required String codigoQr,
    required int eventoId,
    String? registradoPor,
  }) async {
    final data = await _api.post('/asistencia/escanear', {
      'codigoQr': codigoQr,
      'eventoId': eventoId,
      if (registradoPor != null) 'registradoPor': registradoPor,
    });

    final resultadoStr = (data['resultado'] as String?)?.toUpperCase() ?? '';
    final resultado = switch (resultadoStr) {
      'INGRESO'   => ResultadoEscaneo.ingreso,
      'SALIDA'    => ResultadoEscaneo.salida,
      _           => ResultadoEscaneo.rechazado,
    };

    return ResultadoScan(
      resultado: resultado,
      mensaje: data['mensaje'] as String? ?? '',
      nombrePersonal: data['nombrePersonal'] as String?,
      documento: data['documento'] as String?,
      numeroCamiseta: data['numeroCamiseta'] as int?,
      rolAsignado: data['rolAsignado'] as String?,
    );
  }

  /// Lista todos los registros de asistencia de un evento (orden descendente).
  Future<List<RegistroAsistencia>> getRegistrosPorEvento(int eventoId) async {
    final data = await _api.get('/asistencia/evento/$eventoId') as List;
    return data
        .map((j) => RegistroAsistencia.fromJson(j as Map<String, dynamic>))
        .toList();
  }
}
