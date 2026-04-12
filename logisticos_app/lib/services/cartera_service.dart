import 'api_client.dart';
import '../models/pago.dart';

class CarteraResumen {
  final double totalPendiente;
  final List<Pago> registros;

  const CarteraResumen({
    required this.totalPendiente,
    required this.registros,
  });
}

class CarteraService {
  final ApiClient _api;
  CarteraService(this._api);

  Future<CarteraResumen> getCarteraPersonal(int personalId) async {
    final data =
        await _api.get('/cartera/personal/$personalId') as Map<String, dynamic>;

    final totalPendiente =
        (data['totalPendiente'] as num?)?.toDouble() ?? 0.0;

    final registrosJson = (data['registros'] as List?) ?? [];
    final registros = registrosJson.map((r) => _pagoFromJson(r)).toList();

    return CarteraResumen(
      totalPendiente: totalPendiente,
      registros: registros,
    );
  }

  static Pago _pagoFromJson(Map<String, dynamic> j) {
    final estadoStr = (j['estado'] as String?)?.toUpperCase() ?? '';
    final estado = estadoStr == 'COBRADO'
        ? EstadoPago.pagado
        : EstadoPago.pendiente;

    DateTime fecha;
    try {
      fecha = DateTime.parse(j['fechaLiquidacion'] as String);
    } catch (_) {
      fecha = DateTime.now();
    }

    return Pago(
      eventoId: j['eventoId'].toString(),
      eventoNombre: j['nombreEvento'] as String? ?? 'Evento',
      fechaEvento: fecha,
      monto: (j['monto'] as num?)?.toDouble() ?? 0.0,
      estado: estado,
      cuentaGenerada: false,
    );
  }
}
