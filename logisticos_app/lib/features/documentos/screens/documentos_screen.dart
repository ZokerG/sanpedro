import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/documento_personal.dart';
import '../../../state/app_state.dart';
import 'foto_crop_screen.dart';

class DocumentosScreen extends StatefulWidget {
  const DocumentosScreen({super.key});

  @override
  State<DocumentosScreen> createState() => _DocumentosScreenState();
}

class _DocumentosScreenState extends State<DocumentosScreen> {
  List<DocumentoPersonal> _documentos = [];
  bool _loading = true;
  String? _error;
  TipoDocumentoRequerido? _uploading;

  static const _tipos = TipoDocumentoRequerido.values;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final state = AppState.of(context);
    final id = int.parse(state.logistico!.id);
    setState(() { _loading = true; _error = null; });
    try {
      final docs = await state.documentoService.getDocumentos(id);
      if (!mounted) return;
      setState(() { _documentos = docs; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  DocumentoPersonal? _docDe(TipoDocumentoRequerido tipo) {
    try {
      return _documentos.firstWhere((d) => d.tipo == tipo);
    } catch (_) {
      return null;
    }
  }

  Future<void> _subir(TipoDocumentoRequerido tipo) async {
    final result = await FilePicker.platform.pickFiles(
      type: tipo == TipoDocumentoRequerido.fotoPerfil
          ? FileType.image
          : FileType.custom,
      allowedExtensions: tipo == TipoDocumentoRequerido.fotoPerfil
          ? null
          : ['pdf', 'jpg', 'jpeg', 'png'],
      withData: true,
    );
    if (result == null || result.files.isEmpty) return;

    final file = result.files.first;
    if (file.bytes == null) return;

    // Para la foto de perfil, abrir el recortador antes de subir
    Uint8List bytesFinales = file.bytes!;
    String nombreFinal = file.name;

    if (tipo == TipoDocumentoRequerido.fotoPerfil) {
      final cropped = await Navigator.of(context).push<Uint8List>(
        MaterialPageRoute(
          builder: (_) => FotoCropScreen(imageBytes: file.bytes!),
          fullscreenDialog: true,
        ),
      );
      if (cropped == null) return; // usuario canceló
      bytesFinales = cropped;
      nombreFinal = 'foto_perfil.jpg';
    }

    setState(() => _uploading = tipo);
    try {
      final state = AppState.of(context);
      final id = int.parse(state.logistico!.id);
      final nuevo = await state.documentoService.uploadDocumento(
        personalId: id,
        tipo: tipo,
        bytes: bytesFinales,
        filename: nombreFinal,
      );
      if (!mounted) return;
      setState(() {
        _documentos = [
          ..._documentos.where((d) => d.tipo != tipo),
          nuevo,
        ];
      });
      _showSnack('Documento subido correctamente', success: true);
    } catch (e) {
      if (!mounted) return;
      _showSnack('Error al subir: $e');
    } finally {
      if (mounted) setState(() => _uploading = null);
    }
  }

  void _showSnack(String msg, {bool success = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg, style: GoogleFonts.inter(fontSize: 13)),
        backgroundColor: success ? AppColors.green : AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation(AppColors.primary)))
                : _error != null
                    ? _buildError()
                    : _buildLista(),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primary,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 12,
        left: 8,
        right: 20,
        bottom: 20,
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          const SizedBox(width: 4),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mis Documentos',
                style: GoogleFonts.montserrat(
                  fontSize: 19,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
              Text(
                'Expediente personal',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppColors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
          const Spacer(),
          _buildResumen(),
        ],
      ),
    );
  }

  Widget _buildResumen() {
    final verificados = _documentos.where((d) => d.estado == EstadoDocumento.verificado).length;
    final total = _tipos.length;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        '$verificados/$total verificados',
        style: GoogleFonts.montserrat(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.white,
        ),
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 48, color: AppColors.grayBrown),
            const SizedBox(height: 14),
            Text(_error!, textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.grayBrown)),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _load,
              child: Text('Reintentar',
                  style: GoogleFonts.montserrat(
                    fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLista() {
    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
        children: [
          _buildInfoBanner(),
          const SizedBox(height: 20),
          ..._tipos.map((tipo) => _buildDocCard(tipo)),
        ],
      ),
    );
  }

  Widget _buildInfoBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.gold.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.gold.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(Icons.info_outline, size: 18, color: AppColors.gold.withOpacity(0.8)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              'Los documentos verificados no pueden ser reemplazados. Si un documento fue rechazado, puedes volver a subirlo.',
              style: GoogleFonts.inter(
                fontSize: 11,
                color: AppColors.darkBrown.withOpacity(0.7),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDocCard(TipoDocumentoRequerido tipo) {
    final doc = _docDe(tipo);
    final isUploading = _uploading == tipo;
    final bloqueado = doc?.bloqueado ?? false;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: bloqueado
              ? AppColors.green.withOpacity(0.3)
              : doc?.estado == EstadoDocumento.rechazado
                  ? AppColors.primary.withOpacity(0.3)
                  : AppColors.beige,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Ícono
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _iconBgColor(doc).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(_iconData(doc), size: 20, color: _iconBgColor(doc)),
                ),
                const SizedBox(width: 12),
                // Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tipo.label,
                        style: GoogleFonts.montserrat(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.darkBrown,
                        ),
                      ),
                      const SizedBox(height: 4),
                      _buildBadge(doc),
                    ],
                  ),
                ),
                // Acción
                _buildAccion(tipo, doc, isUploading, bloqueado),
              ],
            ),
            // Nombre del archivo
            if (doc != null) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  const SizedBox(width: 42),
                  Icon(Icons.attach_file, size: 12, color: AppColors.grayBrown),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      doc.nombreArchivo,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(fontSize: 11, color: AppColors.grayBrown),
                    ),
                  ),
                ],
              ),
            ],
            // Nota de rechazo
            if (doc?.notaRevision != null && doc!.notaRevision!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.primary.withOpacity(0.15)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.comment_outlined, size: 13, color: AppColors.primary),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        doc.notaRevision!,
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: AppColors.primary,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(DocumentoPersonal? doc) {
    if (doc == null) {
      return _badge('Pendiente de subir', AppColors.grayBrown, Icons.upload_outlined);
    }
    switch (doc.estado) {
      case EstadoDocumento.verificado:
        return _badge('Verificado', AppColors.green, Icons.verified_outlined);
      case EstadoDocumento.rechazado:
        return _badge('Rechazado', AppColors.primary, Icons.cancel_outlined);
      case EstadoDocumento.pendiente:
        return _badge('En revisión', AppColors.gold, Icons.hourglass_top_outlined);
    }
  }

  Widget _badge(String label, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11, color: color),
          const SizedBox(width: 4),
          Text(label, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
        ],
      ),
    );
  }

  Widget _buildAccion(
    TipoDocumentoRequerido tipo,
    DocumentoPersonal? doc,
    bool isUploading,
    bool bloqueado,
  ) {
    // Verificado → candado
    if (bloqueado) {
      return Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.green.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(Icons.lock_outline, size: 18, color: AppColors.green),
      );
    }

    // Subiendo
    if (isUploading) {
      return const SizedBox(
        width: 36, height: 36,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
          valueColor: AlwaysStoppedAnimation(AppColors.primary),
        ),
      );
    }

    // Puede subir/resubir
    final esResubir = doc != null;
    return GestureDetector(
      onTap: () => _subir(tipo),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.primary.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              esResubir ? Icons.refresh : Icons.upload_outlined,
              size: 15,
              color: AppColors.primary,
            ),
            const SizedBox(width: 4),
            Text(
              esResubir ? 'Resubir' : 'Subir',
              style: GoogleFonts.montserrat(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _iconBgColor(DocumentoPersonal? doc) {
    if (doc == null) return AppColors.grayBrown;
    switch (doc.estado) {
      case EstadoDocumento.verificado:
        return AppColors.green;
      case EstadoDocumento.rechazado:
        return AppColors.primary;
      case EstadoDocumento.pendiente:
        return AppColors.gold;
    }
  }

  IconData _iconData(DocumentoPersonal? doc) {
    if (doc == null) return Icons.insert_drive_file_outlined;
    switch (doc.estado) {
      case EstadoDocumento.verificado:
        return Icons.task_alt;
      case EstadoDocumento.rechazado:
        return Icons.highlight_off;
      case EstadoDocumento.pendiente:
        return Icons.pending_outlined;
    }
  }
}
