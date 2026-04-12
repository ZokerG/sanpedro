import 'package:flutter/material.dart';
import '../models/auditor.dart';
import '../models/evento_resumen.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';
import '../services/evento_service.dart';
import '../services/asistencia_service.dart';

class AppState extends InheritedNotifier<AppStateController> {
  const AppState({
    super.key,
    required AppStateController controller,
    required super.child,
  }) : super(notifier: controller);

  static AppStateController of(BuildContext context) {
    final state = context.dependOnInheritedWidgetOfExactType<AppState>();
    assert(state != null, 'AppState not found in widget tree');
    return state!.notifier!;
  }
}

class AppStateController extends ChangeNotifier {
  final ApiClient _api;

  late final AuthService authService;
  late final EventoService eventoService;
  late final AsistenciaService asistenciaService;

  Auditor? _auditor;
  Auditor? get auditor => _auditor;

  EventoResumen? _eventoSeleccionado;
  EventoResumen? get eventoSeleccionado => _eventoSeleccionado;

  AppStateController() : _api = ApiClient() {
    authService = AuthService(_api);
    eventoService = EventoService(_api);
    asistenciaService = AsistenciaService(_api);
  }

  void setAuditor(Auditor auditor) {
    _auditor = auditor;
    notifyListeners();
  }

  void setEvento(EventoResumen evento) {
    _eventoSeleccionado = evento;
    notifyListeners();
  }

  void clearEvento() {
    _eventoSeleccionado = null;
    notifyListeners();
  }

  void clearSession() {
    _auditor = null;
    _eventoSeleccionado = null;
    notifyListeners();
  }
}
