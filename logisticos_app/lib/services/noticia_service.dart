import '../services/api_client.dart';
import '../models/noticia.dart';

class NoticiaService {
  final ApiClient _api;

  NoticiaService(this._api);

  Future<List<Noticia>> obtenerTodas() async {
    final data = await _api.get('/noticias');
    return (data as List).map((j) => Noticia.fromJson(j)).toList();
  }

  Future<List<Noticia>> obtenerDestacadas() async {
    final data = await _api.get('/noticias/destacadas');
    return (data as List).map((j) => Noticia.fromJson(j)).toList();
  }

  Future<List<Noticia>> obtenerPorPlanta(String planta) async {
    final data = await _api.get('/noticias/planta/$planta');
    return (data as List).map((j) => Noticia.fromJson(j)).toList();
  }

  Future<Noticia> obtenerPorId(int id) async {
    final data = await _api.get('/noticias/$id');
    return Noticia.fromJson(data);
  }
}
