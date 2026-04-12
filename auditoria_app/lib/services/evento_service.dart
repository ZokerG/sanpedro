import 'api_client.dart';
import '../models/evento_resumen.dart';

class EventoService {
  final ApiClient _api;
  EventoService(this._api);

  /// Retorna eventos activos (PLANEADO, EN_PREPARACION, EN_CURSO) ordenados por fecha.
  Future<List<EventoResumen>> getEventosActivos() async {
    final data = await _api.get('/eventos') as List;
    final todos = data
        .map((j) => EventoResumen.fromJson(j as Map<String, dynamic>))
        .toList();
    final activos = todos.where((e) => e.esActivo).toList()
      ..sort((a, b) => a.fechaInicio.compareTo(b.fechaInicio));
    return activos;
  }
}
