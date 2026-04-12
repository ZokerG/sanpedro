import '../models/evento.dart';
import '../models/logistico.dart';
import '../models/pago.dart';

class MockData {
  MockData._();

  static const Logistico logistico = Logistico(
    id: 'LOG-2024-089',
    nombre: 'Carlos Andrés Vargas',
    documento: '1.075.234.891',
    cargo: 'Personal logístico',
  );

  static final List<Evento> eventos = [
    Evento(
      id: 'EVT-001',
      nombre: 'Cabalgata Central San Pedro',
      fecha: DateTime(2025, 6, 27),
      horaInicio: '07:00 AM',
      ubicacion: 'Carrera 5a con Calle 10, Neiva',
      tarifa: 120000,
      estado: EstadoEvento.enCurso,
      horaIngresoRegistrado: '06:45 AM',
      horaSalidaRegistrada: null,
      cuentaGenerada: false,
    ),
    Evento(
      id: 'EVT-002',
      nombre: 'Desfile Folclórico de Comparsas',
      fecha: DateTime(2025, 6, 29),
      horaInicio: '04:00 PM',
      ubicacion: 'Avenida La Toma, Neiva',
      tarifa: 100000,
      estado: EstadoEvento.proximo,
      cuentaGenerada: false,
    ),
    Evento(
      id: 'EVT-003',
      nombre: 'Festival Reinado Nacional del Bambuco',
      fecha: DateTime(2025, 7, 3),
      horaInicio: '08:00 PM',
      ubicacion: 'Coliseo Los Cambulos, Neiva',
      tarifa: 150000,
      estado: EstadoEvento.proximo,
      cuentaGenerada: false,
    ),
    Evento(
      id: 'EVT-004',
      nombre: 'Concierto Noche de Bambucos',
      fecha: DateTime(2025, 6, 20),
      horaInicio: '07:00 PM',
      ubicacion: 'Parque Santander, Neiva',
      tarifa: 90000,
      estado: EstadoEvento.liquidacion,
      horaIngresoRegistrado: '06:30 PM',
      horaSalidaRegistrada: '11:15 PM',
      cuentaGenerada: false,
    ),
    Evento(
      id: 'EVT-005',
      nombre: 'Muestra Artesanal del Huila',
      fecha: DateTime(2025, 6, 15),
      horaInicio: '09:00 AM',
      ubicacion: 'Plaza Cívica La Gaitana, Neiva',
      tarifa: 80000,
      estado: EstadoEvento.finalizado,
      horaIngresoRegistrado: '08:50 AM',
      horaSalidaRegistrada: '06:00 PM',
      cuentaGenerada: true,
    ),
  ];

  static Evento get proximoEvento =>
      eventos.firstWhere((e) => e.estado == EstadoEvento.enCurso,
          orElse: () => eventos.firstWhere(
              (e) => e.estado == EstadoEvento.proximo,
              orElse: () => eventos.first));

  static final List<Pago> pagos = [
    Pago(
      eventoId: 'EVT-004',
      eventoNombre: 'Concierto Noche de Bambucos',
      fechaEvento: DateTime(2025, 6, 20),
      monto: 90000,
      estado: EstadoPago.enLiquidacion,
      cuentaGenerada: false,
    ),
    Pago(
      eventoId: 'EVT-005',
      eventoNombre: 'Muestra Artesanal del Huila',
      fechaEvento: DateTime(2025, 6, 15),
      monto: 80000,
      estado: EstadoPago.pagado,
      cuentaGenerada: true,
    ),
    Pago(
      eventoId: 'EVT-006',
      eventoNombre: 'Apertura del Festival San Pedro',
      fechaEvento: DateTime(2025, 6, 10),
      monto: 110000,
      estado: EstadoPago.pagado,
      cuentaGenerada: true,
    ),
  ];

  static double get totalAcumulado =>
      pagos.where((p) => p.estado == EstadoPago.pagado).fold(0, (sum, p) => sum + p.monto);
}
