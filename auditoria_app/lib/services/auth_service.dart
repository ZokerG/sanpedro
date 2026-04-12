import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';
import '../models/auditor.dart';

class AuthService {
  static const _keyToken   = 'audit_token';
  static const _keyId      = 'audit_id';
  static const _keyNombre  = 'audit_nombre';
  static const _keyRol     = 'audit_rol';

  final ApiClient _api;
  AuthService(this._api);

  /// Paso 1: solicita OTP al correo de contacto.
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

  /// Paso 2: verifica OTP y retorna el Auditor si tiene el rol correcto.
  /// Lanza [RolNoPermitidoException] si el rol no es AUDITOR.
  Future<Auditor> verifyOtp(String email, String otp) async {
    final data = await _api.post('/auth/app/verify-otp', {
      'email': email,
      'otp': otp,
    });

    final rol = data['rol'] as String? ?? '';
    if (rol.toUpperCase() != 'AUDITOR') {
      throw RolNoPermitidoException(
        'Esta aplicación es exclusiva para auditores. '
        'Tu usuario tiene el rol "$rol".',
      );
    }

    final token = data['token'] as String;
    _api.setToken(token);

    final auditor = Auditor(
      id: data['personalId'].toString(),
      nombre: data['nombre'] as String,
      rol: rol,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken,  token);
    await prefs.setString(_keyId,     auditor.id);
    await prefs.setString(_keyNombre, auditor.nombre);
    await prefs.setString(_keyRol,    auditor.rol);

    return auditor;
  }

  Future<void> logout() async {
    _api.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyId);
    await prefs.remove(_keyNombre);
    await prefs.remove(_keyRol);
  }

  /// Restaura sesión desde SharedPreferences sin llamar al backend.
  Future<Auditor?> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_keyToken);
    if (token == null) return null;

    _api.setToken(token);

    final id     = prefs.getString(_keyId);
    final nombre = prefs.getString(_keyNombre);
    final rol    = prefs.getString(_keyRol);
    if (id == null || nombre == null || rol == null) return null;

    return Auditor(id: id, nombre: nombre, rol: rol);
  }
}

class AppLoginInitResult {
  final String message;
  final String emailMasked;
  const AppLoginInitResult({required this.message, required this.emailMasked});
}

class RolNoPermitidoException implements Exception {
  final String message;
  const RolNoPermitidoException(this.message);
  @override
  String toString() => message;
}
