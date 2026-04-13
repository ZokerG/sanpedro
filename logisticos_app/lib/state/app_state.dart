import 'package:flutter/material.dart';
import '../models/logistico.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';
import '../services/personal_service.dart';
import '../services/evento_service.dart';
import '../services/solicitud_service.dart';
import '../services/cartera_service.dart';
import '../features/auth/screens/login_screen.dart';

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
  final GlobalKey<NavigatorState> navigatorKey;

  late final AuthService authService;
  late final PersonalService personalService;
  late final EventoService eventoService;
  late final SolicitudService solicitudService;
  late final CarteraService carteraService;

  Logistico? _logistico;
  Logistico? get logistico => _logistico;

  AppStateController({GlobalKey<NavigatorState>? navigatorKey})
      : _api = ApiClient(),
        navigatorKey = navigatorKey ?? GlobalKey<NavigatorState>() {
    authService = AuthService(_api);
    personalService = PersonalService(_api);
    eventoService = EventoService(_api);
    solicitudService = SolicitudService(_api);
    carteraService = CarteraService(_api);

    // Cuando el token expira, limpiar sesión y volver al login
    _api.onUnauthorized = _handleSessionExpired;
  }

  void _handleSessionExpired() {
    authService.logout();
    _logistico = null;
    notifyListeners();
    navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  void setLogistico(Logistico logistico) {
    _logistico = logistico;
    notifyListeners();
  }

  void updateFotoPerfil(String fotoPerfil) {
    if (_logistico == null) return;
    _logistico = _logistico!.copyWith(fotoPerfil: fotoPerfil);
    notifyListeners();
  }

  void clearSession() {
    _logistico = null;
    notifyListeners();
  }
}
