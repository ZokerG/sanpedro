import 'api_client.dart';
import '../models/evento.dart';
import '../models/pago.dart';

class EventoService {
  final ApiClient _api;
  EventoService(this._api);

  /// Asignaciones del personal con el detalle del evento incluido
  Future<List<Evento>> getEventosDePersonal(int personalId) async {
    final asignaciones =
        await _api.get('/asignaciones/personal/$personalId') as List;

    final eventos = <Evento>[];
    for (final a in asignaciones) {
      if (a['activo'] != true) continue;
      final eventoId = a['eventoId'] as int;
      try {
        final eventoData =
            await _api.get('/eventos/$eventoId') as Map<String, dynamic>;
        eventos.add(_eventoFromJson(eventoData));
      } catch (_) {
        // Si falla obtener un evento, lo omitimos
      }
    }
    return eventos;
  }

  Future<Evento> getById(int id) async {
    final data = await _api.get('/eventos/$id') as Map<String, dynamic>;
    return _eventoFromJson(data);
  }

  /// Pagos: asignaciones de eventos EJECUTADO o LIQUIDADO
  Future<List<Pago>> getPagosDePersonal(int personalId) async {
    final asignaciones =
        await _api.get('/asignaciones/personal/$personalId') as List;

    final pagos = <Pago>[];
    for (final a in asignaciones) {
      if (a['activo'] != true) continue;
      final eventoId = a['eventoId'] as int;
      try {
        final eventoData =
            await _api.get('/eventos/$eventoId') as Map<String, dynamic>;
        final estadoStr = eventoData['estado'] as String;
        final estadoEvento = _parseEstado(estadoStr);
        if (estadoEvento == EstadoEvento.liquidacion ||
            estadoEvento == EstadoEvento.finalizado) {
          pagos.add(_pagoFromJson(eventoData));
        }
      } catch (_) {}
    }
    return pagos;
  }

  static Evento eventoFromJson(Map<String, dynamic> j) => _eventoFromJson(j);

  static Evento _eventoFromJson(Map<String, dynamic> j) {
    final fechaInicio = DateTime.parse(j['fechaInicio'] as String);
    final estado = _parseEstado(j['estado'] as String);

    return Evento(
      id: j['id'].toString(),
      nombre: j['nombre'] as String,
      fecha: fechaInicio,
      horaInicio: _horaStr(fechaInicio),
      ubicacion: j['ubicacionLogistica'] as String? ?? 'Sin especificar',
      tarifa: (j['cuotaPago'] as num?)?.toDouble() ?? 0,
      estado: estado,
      cuentaGenerada: false,
    );
  }

  static Pago _pagoFromJson(Map<String, dynamic> j) {
    final fecha = DateTime.parse(j['fechaInicio'] as String);
    final estado = _parseEstado(j['estado'] as String);

    return Pago(
      eventoId: j['id'].toString(),
      eventoNombre: j['nombre'] as String,
      fechaEvento: fecha,
      monto: (j['cuotaPago'] as num?)?.toDouble() ?? 0,
      estado: estado == EstadoEvento.liquidacion
          ? EstadoPago.enLiquidacion
          : EstadoPago.pagado,
      cuentaGenerada: false,
    );
  }

  static EstadoEvento _parseEstado(String s) {
    switch (s.toUpperCase()) {
      case 'EN_CURSO':
        return EstadoEvento.enCurso;
      case 'LIQUIDADO':
        return EstadoEvento.liquidacion;
      case 'EJECUTADO':
        return EstadoEvento.finalizado;
      default:
        return EstadoEvento.proximo; // PLANEADO, EN_PREPARACION
    }
  }

  static String _horaStr(DateTime dt) {
    final h = dt.hour;
    final m = dt.minute.toString().padLeft(2, '0');
    final ampm = h >= 12 ? 'PM' : 'AM';
    final h12 = h % 12 == 0 ? 12 : h % 12;
    return '$h12:$m $ampm';
  }
}
