import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';

class AuthService {
  static const _keyToken = 'auth_token';
  static const _keyEmail = 'auth_email';
  static const _keyRol = 'auth_rol';

  final ApiClient _api;

  AuthService(this._api);

  /// Login → retorna el token JWT y el rol
  Future<AuthResult> login(String correo, String contrasena) async {
    final data = await _api.post('/auth/login', {
      'correo': correo,
      'contrasena': contrasena,
    });
    final token = data['token'] as String;
    final rol = data['rol'] as String;

    _api.setToken(token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
    await prefs.setString(_keyEmail, correo);
    await prefs.setString(_keyRol, rol);

    return AuthResult(token: token, correo: correo, rol: rol);
  }

  Future<void> logout() async {
    _api.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyEmail);
    await prefs.remove(_keyRol);
  }

  /// Restaura el token guardado al iniciar la app
  Future<String?> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_keyToken);
    if (token != null) _api.setToken(token);
    return token;
  }

  Future<String?> getSavedEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyEmail);
  }
}

class AuthResult {
  final String token;
  final String correo;
  final String rol;
  const AuthResult({required this.token, required this.correo, required this.rol});
}
