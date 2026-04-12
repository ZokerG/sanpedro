import 'api_client.dart';
import '../models/evento.dart';
import '../models/solicitud.dart';
import 'evento_service.dart';

class SolicitudService {
  final ApiClient _api;
  SolicitudService(this._api);

  /// Eventos donde el logístico NO está asignado y puede solicitar.
  /// Solo incluye eventos en estado PLANEADO o EN_PREPARACION (próximos).
  Future<List<Evento>> getEventosDisponibles(int personalId) async {
    // 1. Todos los eventos
    final todos = await _api.get('/eventos') as List;

    // 2. IDs de eventos donde ya está asignado
    final asignaciones =
        await _api.get('/asignaciones/personal/$personalId') as List;
    final asignadosIds = asignaciones
        .where((a) => a['activo'] == true)
        .map((a) => a['eventoId'] as int)
        .toSet();

    // 3. IDs de eventos donde ya tiene solicitud activa
    final solicitudes = await getMisSolicitudes(personalId);
    final solicitadosIds = solicitudes
        .where((s) =>
            s.estado == EstadoSolicitud.pendiente ||
            s.estado == EstadoSolicitud.aprobada)
        .map((s) => s.eventoId)
        .toSet();

    // 4. Filtrar: no asignado, no solicitado, y estado aceptable
    return todos
        .where((e) {
          final id = e['id'] as int;
          final estado = (e['estado'] as String).toUpperCase();
          final estadoOk =
              estado == 'PLANEADO' || estado == 'EN_PREPARACION' || estado == 'EN_CURSO';
          return !asignadosIds.contains(id) &&
              !solicitadosIds.contains(id) &&
              estadoOk;
        })
        .map((e) => EventoService.eventoFromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<Solicitud>> getMisSolicitudes(int personalId) async {
    final list = await _api.get('/solicitudes/personal/$personalId') as List;
    return list.map((s) => _fromJson(s as Map<String, dynamic>)).toList();
  }

  Future<Solicitud> crearSolicitud(int personalId, int eventoId,
      {String? rolAsignado}) async {
    final body = <String, dynamic>{'eventoId': eventoId};
    if (rolAsignado != null && rolAsignado.isNotEmpty) {
      body['rolAsignado'] = rolAsignado;
    }
    final data =
        await _api.post('/solicitudes/personal/$personalId', body) as Map<String, dynamic>;
    return _fromJson(data);
  }

  Future<void> cancelarSolicitud(int solicitudId) async {
    await _api.patch('/solicitudes/$solicitudId/cancelar', {});
  }

  static Solicitud _fromJson(Map<String, dynamic> j) {
    return Solicitud(
      id: j['id'] as int,
      eventoId: j['eventoId'] as int,
      eventoNombre: j['eventoNombre'] as String? ?? 'Evento',
      estado: _parseEstado(j['estado'] as String),
      fechaSolicitud: DateTime.parse(j['fechaSolicitud'] as String),
      notaRechazo: j['notaRechazo'] as String?,
      rolAsignado: j['rolAsignado'] as String?,
    );
  }

  static EstadoSolicitud _parseEstado(String s) {
    switch (s.toUpperCase()) {
      case 'APROBADA':
        return EstadoSolicitud.aprobada;
      case 'RECHAZADA':
        return EstadoSolicitud.rechazada;
      case 'CANCELADA':
        return EstadoSolicitud.cancelada;
      default:
        return EstadoSolicitud.pendiente;
    }
  }
}
