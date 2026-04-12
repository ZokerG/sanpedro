import 'package:flutter/material.dart';
import '../models/logistico.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';
import '../services/personal_service.dart';
import '../services/evento_service.dart';
import '../services/solicitud_service.dart';

/// Comparte servicios y estado de sesión en todo el árbol de widgets.
class AppState extends InheritedNotifier<AppStateController> {
  const AppState({
    super.key,
    required AppStateController controller,
    required super.child,
  }) : super(notifier: controller);

  static AppStateController of(BuildContext context) {
    final state =
        context.dependOnInheritedWidgetOfExactType<AppState>();
    assert(state != null, 'AppState not found in widget tree');
    return state!.notifier!;
  }
}

class AppStateController extends ChangeNotifier {
  final ApiClient _api;

  late final AuthService authService;
  late final PersonalService personalService;
  late final EventoService eventoService;
  late final SolicitudService solicitudService;

  Logistico? _logistico;
  Logistico? get logistico => _logistico;

  AppStateController() : _api = ApiClient() {
    authService = AuthService(_api);
    personalService = PersonalService(_api);
    eventoService = EventoService(_api);
    solicitudService = SolicitudService(_api);
  }

  void setLogistico(Logistico logistico) {
    _logistico = logistico;
    notifyListeners();
  }

  void clearSession() {
    _logistico = null;
    notifyListeners();
  }
}
