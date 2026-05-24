import '../services/api_client.dart';

class JornadaService {
  final ApiClient _api;

  JornadaService(this._api);

  Future<Map<String, dynamic>> iniciarJornada({int? eventoId}) {
    return _api.post('/jornadas/iniciar', {
      if (eventoId != null) 'eventoId': eventoId,
    });
  }

  Future<Map<String, dynamic>> cambiarEstado(
    int jornadaId,
    String nuevoEstado,
  ) async {
    final result = await _api.patch('/jornadas/$jornadaId/estado', {
      'nuevoEstado': nuevoEstado,
    });
    return result as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> reportarUbicacion(
    int jornadaId,
    double latitud,
    double longitud, {
    double? precision,
  }) {
    return _api.post('/jornadas/$jornadaId/ubicacion', {
      'latitud': latitud,
      'longitud': longitud,
      if (precision != null) 'precisionGps': precision,
    });
  }

  Future<Map<String, dynamic>> obtenerJornadaActiva() async {
    final result = await _api.get('/jornadas/activa');
    return result as Map<String, dynamic>;
  }
}
