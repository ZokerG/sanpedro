import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';
import '../models/logistico.dart';

class AuthService {
  static const _keyToken      = 'auth_token';
  static const _keyEmail      = 'auth_email';
  static const _keyPersonalId = 'auth_personal_id';
  static const _keyNombre     = 'auth_nombre';
  static const _keyRol        = 'auth_rol';
  static const _keyCodigoQr   = 'auth_codigo_qr';

  final ApiClient _api;
  AuthService(this._api);

  // ── Paso 1: envía OTP al correo de contacto ─────────────────────────────
  Future<AppLoginInitResult> appLogin(String email, String documento) async {
    final data = await _api.post('/auth/app/login', {
      'email': email,
      'documento': documento,
    });
    return AppLoginInitResult(
      message: data['message'] as String,
      emailMasked: data['emailMasked'] as String,
    );
  }

  // ── Paso 2: verifica OTP y retorna JWT + datos del personal ──────────────
  Future<Logistico> verifyOtp(String email, String otp) async {
    final data = await _api.post('/auth/app/verify-otp', {
      'email': email,
      'otp': otp,
    });

    final token = data['token'] as String;
    _api.setToken(token);

    final logistico = Logistico(
      id: data['personalId'].toString(),
      nombre: data['nombre'] as String,
      documento: '',
      cargo: data['rol'] as String,
      codigoQr: data['codigoQr'] as String?,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken,      token);
    await prefs.setString(_keyEmail,      email);
    await prefs.setString(_keyPersonalId, logistico.id);
    await prefs.setString(_keyNombre,     logistico.nombre);
    await prefs.setString(_keyRol,        logistico.cargo);
    if (logistico.codigoQr != null) {
      await prefs.setString(_keyCodigoQr, logistico.codigoQr!);
    }

    return logistico;
  }

  Future<void> logout() async {
    _api.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyEmail);
    await prefs.remove(_keyPersonalId);
    await prefs.remove(_keyNombre);
    await prefs.remove(_keyRol);
    await prefs.remove(_keyCodigoQr);
  }

  /// Restaura sesión desde SharedPreferences sin llamar al backend.
  Future<Logistico?> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_keyToken);
    if (token == null) return null;

    _api.setToken(token);

    final id     = prefs.getString(_keyPersonalId);
    final nombre = prefs.getString(_keyNombre);
    final rol    = prefs.getString(_keyRol);
    if (id == null || nombre == null || rol == null) return null;

    return Logistico(
      id: id,
      nombre: nombre,
      documento: '',
      cargo: rol,
      codigoQr: prefs.getString(_keyCodigoQr),
    );
  }
}

class AppLoginInitResult {
  final String message;
  final String emailMasked;
  const AppLoginInitResult({required this.message, required this.emailMasked});
}
