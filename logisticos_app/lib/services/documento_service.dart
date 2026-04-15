import 'package:http/http.dart' as http;
import 'api_client.dart';
import '../models/documento_personal.dart';

class DocumentoService {
  final ApiClient _api;
  DocumentoService(this._api);

  Future<List<DocumentoPersonal>> getDocumentos(int personalId) async {
    final list = await _api.get('/personal/$personalId/documentos') as List;
    return list
        .map((e) => DocumentoPersonal.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<DocumentoPersonal> uploadDocumento({
    required int personalId,
    required TipoDocumentoRequerido tipo,
    required List<int> bytes,
    required String filename,
  }) async {
    final multipartFile = http.MultipartFile.fromBytes(
      'file',
      bytes,
      filename: filename,
    );

    final data = await _api.postMultipart(
      '/personal/$personalId/documentos',
      {'tipo': tipo.apiValue},
      [multipartFile],
    );

    return DocumentoPersonal.fromJson(data);
  }
}
