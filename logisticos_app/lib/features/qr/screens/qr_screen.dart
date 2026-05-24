import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../state/app_state.dart';

// Mismos colores que el carnet web
Color _colorDeTipo(String? tipo) {
  switch ((tipo ?? '').toUpperCase()) {
    case 'ADMINISTRATIVO':
      return const Color(0xFF1A6B3C);
    case 'PRENSA':
      return const Color(0xFFD4A017);
    default:
      return AppColors.primary; // LOGISTICO = rojo
  }
}

class QrScreen extends StatelessWidget {
  const QrScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final logistico = AppState.of(context).logistico;
    if (logistico == null) return const SizedBox.shrink();

    final color = _colorDeTipo(logistico.tipoPersonal);

    // Foto desde base64
    ImageProvider? fotoProvider;
    if (logistico.fotoPerfil != null && logistico.fotoPerfil!.contains(',')) {
      try {
        final bytes = base64Decode(logistico.fotoPerfil!.split(',').last);
        fotoProvider = MemoryImage(bytes);
      } catch (_) {}
    }

    final iniciales = logistico.nombre
        .split(' ')
        .where((w) => w.isNotEmpty)
        .map((w) => w[0])
        .take(2)
        .join()
        .toUpperCase();

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          // Header
          Container(
            color: color,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 16,
              left: 20,
              right: 20,
              bottom: 20,
            ),
            child: Row(
              children: [
                Text(
                  'Mi QR',
                  style: GoogleFonts.montserrat(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const Spacer(),
                const Icon(Icons.qr_code_2, color: Colors.white, size: 26),
              ],
            ),
          ),
          // Contenido
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 28, 24, 28),
              child: Column(
                children: [
                  // Avatar con foto real
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: color, width: 3),
                      color: AppColors.darkBrown,
                      image: fotoProvider != null
                          ? DecorationImage(image: fotoProvider, fit: BoxFit.cover)
                          : null,
                    ),
                    child: fotoProvider == null
                        ? Center(
                            child: Text(
                              iniciales,
                              style: GoogleFonts.montserrat(
                                fontSize: 30,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(height: 14),
                  Text(
                    logistico.nombre.toUpperCase(),
                    style: GoogleFonts.montserrat(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: AppColors.darkBrown,
                      letterSpacing: 0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      logistico.cargo,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: color,
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),
                  // Tarjeta QR estilo carnet
                  _QrCard(
                    codigoQr: logistico.codigoQr ?? logistico.id,
                    color: color,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Este es tu código de identificación único. No lo compartas.',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.darkBrown.withOpacity(0.5),
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _QrCard extends StatelessWidget {
  final String codigoQr;
  final Color color;

  const _QrCard({required this.codigoQr, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.07),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          // Barra de color superior (igual que carnet)
          Container(
            height: 10,
            decoration: BoxDecoration(
              color: color,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
          ),

          // Título estilo carnet: "65 Festival del Bambuco"
          Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 4),
            child: Column(
              children: [
                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: '65 ',
                        style: GoogleFonts.pacifico(
                          fontSize: 22,
                          color: color,
                        ),
                      ),
                      TextSpan(
                        text: 'Festival del Bambuco',
                        style: GoogleFonts.pacifico(
                          fontSize: 14,
                          color: const Color(0xFF1e293b),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'CORPOSANPEDRO',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.w600,
                    color: Colors.black38,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  width: 40,
                  height: 1.5,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ],
            ),
          ),

          // QR con logo en el centro + esquinas decorativas
          Padding(
            padding: const EdgeInsets.fromLTRB(28, 16, 28, 8),
            child: SizedBox(
              width: 220,
              height: 220,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // QR
                  QrImageView(
                    data: codigoQr,
                    version: QrVersions.auto,
                    size: 200,
                    backgroundColor: Colors.white,
                    eyeStyle: const QrEyeStyle(
                      eyeShape: QrEyeShape.square,
                      color: Colors.black87,
                    ),
                    dataModuleStyle: const QrDataModuleStyle(
                      dataModuleShape: QrDataModuleShape.square,
                      color: Colors.black87,
                    ),
                    embeddedImage: const AssetImage('assets/images/logo_corposanpedro.png'),
                    embeddedImageStyle: const QrEmbeddedImageStyle(
                      size: Size(22, 22),
                    ),
                  ),
                  // Esquinas decorativas ancladas al contenedor de 220x220
                  Positioned(top: 0, left: 0, child: _CornerBracket(color: color, top: true, left: true)),
                  Positioned(top: 0, right: 0, child: _CornerBracket(color: color, top: true, left: false)),
                  Positioned(bottom: 0, left: 0, child: _CornerBracket(color: color, top: false, left: true)),
                  Positioned(bottom: 0, right: 0, child: _CornerBracket(color: color, top: false, left: false)),
                ],
              ),
            ),
          ),

          // Texto inferior
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
            child: Text(
              'Escanea para verificar identidad',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Colors.black38,
                letterSpacing: 1,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

// Esquinas decorativas igual que el carnet
class _CornerBracket extends StatelessWidget {
  final Color color;
  final bool top;
  final bool left;

  const _CornerBracket({required this.color, required this.top, required this.left});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 20,
      height: 20,
      child: CustomPaint(
        painter: _BracketPainter(color: color, top: top, left: left),
      ),
    );
  }
}

class _BracketPainter extends CustomPainter {
  final Color color;
  final bool top;
  final bool left;

  const _BracketPainter({required this.color, required this.top, required this.left});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final x = left ? 0.0 : size.width;
    final y = top ? 0.0 : size.height;
    final dx = left ? size.width : -size.width;
    final dy = top ? size.height : -size.height;

    // línea horizontal
    canvas.drawLine(Offset(x, y), Offset(x + dx, y), paint);
    // línea vertical
    canvas.drawLine(Offset(x, y), Offset(x, y + dy), paint);
  }

  @override
  bool shouldRepaint(_BracketPainter old) => false;
}
