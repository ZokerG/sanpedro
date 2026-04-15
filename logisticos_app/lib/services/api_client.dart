import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiClient {
  static const String _baseUrl = 'https://sanpedro-production.up.railway.app/api';

  final http.Client _client;
  String? _token;

  /// Se llama cuando el servidor devuelve 401 (token expirado / inválido).
  void Function()? onUnauthorized;

  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  void setToken(String token) => _token = token;
  void clearToken() => _token = null;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final response = await _client.post(
      Uri.parse('$_baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    return _handle(response);
  }

  Future<dynamic> patch(String path, Map<String, dynamic> body) async {
    final response = await _client.patch(
      Uri.parse('$_baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    if (response.statusCode == 204) return null;
    return _handle(response);
  }

  Future<dynamic> get(String path) async {
    final response = await _client.get(
      Uri.parse('$_baseUrl$path'),
      headers: _headers,
    );
    return _handle(response);
  }

  Future<Map<String, dynamic>> postMultipart(
    String path,
    Map<String, String> fields,
    List<http.MultipartFile> files,
  ) async {
    final request = http.MultipartRequest('POST', Uri.parse('$_baseUrl$path'));
    if (_token != null) {
      request.headers['Authorization'] = 'Bearer $_token';
    }
    request.fields.addAll(fields);
    request.files.addAll(files);

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    return _handle(response) as Map<String, dynamic>;
  }

  dynamic _handle(http.Response response) {
    final rawBody = utf8.decode(response.bodyBytes).trim();

    // 401 → notificar y lanzar excepción antes de intentar parsear
    if (response.statusCode == 401) {
      onUnauthorized?.call();
      throw ApiException(401, 'Sesión expirada. Por favor ingresa de nuevo.');
    }

    // Body vacío en respuesta exitosa
    if (rawBody.isEmpty) {
      if (response.statusCode >= 200 && response.statusCode < 300) return null;
      throw ApiException(response.statusCode, 'Error ${response.statusCode}');
    }

    final body = jsonDecode(rawBody);
    if (response.statusCode >= 200 && response.statusCode < 300) return body;

    final msg = body is Map ? (body['message'] ?? body['error'] ?? 'Error') : 'Error';
    throw ApiException(response.statusCode, msg.toString());
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;
  const ApiException(this.statusCode, this.message);

  @override
  String toString() => message;

  bool get isUnauthorized => statusCode == 401;
  bool get isNotFound => statusCode == 404;
}
