import 'api_client.dart';
import '../models/logistico.dart';
import '../models/perfil_logistico.dart';

class PersonalService {
  final ApiClient _api;
  PersonalService(this._api);

  /// Obtiene el personal logístico cuyo usuario tiene el email dado.
  Future<Logistico> getByEmail(String email) async {
    final list = await _api.get('/personal?tipo=LOGISTICO') as List;
    final match = list.firstWhere(
      (p) => (p['usuarioEmail'] as String?)?.toLowerCase() == email.toLowerCase(),
      orElse: () => throw ApiException(404, 'No se encontró personal con ese correo'),
    );
    return _fromJson(match as Map<String, dynamic>);
  }

  Future<Logistico> getById(int id) async {
    final data = await _api.get('/personal/$id') as Map<String, dynamic>;
    return _fromJson(data);
  }

  Future<PerfilLogistico> getPerfil(int id) async {
    final data = await _api.get('/personal/$id/perfil') as Map<String, dynamic>;
    return PerfilLogistico.fromJson(data);
  }

  static Logistico _fromJson(Map<String, dynamic> j) {
    return Logistico(
      id: j['id'].toString(),
      nombre: j['nombreCompleto'] as String? ??
          '${j['primerNombre']} ${j['primerApellido']}',
      documento: j['numeroDocumento'] as String? ?? '',
      cargo: j['cargoNombre'] as String? ?? 'Personal logístico',
      codigoQr: j['codigoQr'] as String?,
      tipoPersonal: j['tipoPersonal'] as String?,
    );
  }
}
