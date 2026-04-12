import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../state/app_state.dart';

class QrScreen extends StatelessWidget {
  const QrScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final logistico = AppState.of(context).logistico;
    if (logistico == null) return const SizedBox.shrink();

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          // Header
          _buildHeader(context),
          // Contenido
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 28, 24, 28),
              child: Column(
                children: [
                  // Avatar circular grande
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.gold, width: 3),
                      color: AppColors.darkBrown,
                    ),
                    child: Center(
                      child: Text(
                        logistico.nombre
                            .split(' ')
                            .map((p) => p[0])
                            .take(2)
                            .join(),
                        style: GoogleFonts.montserrat(
                          fontSize: 30,
                          fontWeight: FontWeight.w700,
                          color: AppColors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    logistico.nombre,
                    style: GoogleFonts.montserrat(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.darkBrown,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    logistico.cargo,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: AppColors.grayBrown,
                    ),
                  ),
                  const SizedBox(height: 28),
                  // Tarjeta QR — usa codigoQr del backend si existe
                  _QrCard(logisticoId: logistico.codigoQr ?? logistico.id),
                  const SizedBox(height: 20),
                  // Texto de apoyo
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      'Este es tu código de identificación único. No lo compartas.',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: AppColors.darkBrown.withOpacity(0.6),
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primary,
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
              color: AppColors.white,
            ),
          ),
          const Spacer(),
          const Icon(Icons.qr_code_2, color: AppColors.white, size: 26),
        ],
      ),
    );
  }
}

class _QrCard extends StatelessWidget {
  final String logisticoId;

  const _QrCard({required this.logisticoId});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.beige, width: 0.5),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          // Franja dorada superior
          Container(
            height: 5,
            decoration: const BoxDecoration(
              color: AppColors.gold,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(28),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Íconos decorativos sombrero en esquinas
                Positioned(
                  top: 0,
                  left: 0,
                  child: Opacity(
                    opacity: 0.10,
                    child: CustomPaint(
                      size: const Size(32, 22),
                      painter: _MiniHatPainter(),
                    ),
                  ),
                ),
                Positioned(
                  top: 0,
                  right: 0,
                  child: Opacity(
                    opacity: 0.10,
                    child: CustomPaint(
                      size: const Size(32, 22),
                      painter: _MiniHatPainter(),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  left: 0,
                  child: Opacity(
                    opacity: 0.10,
                    child: CustomPaint(
                      size: const Size(32, 22),
                      painter: _MiniHatPainter(),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Opacity(
                    opacity: 0.10,
                    child: CustomPaint(
                      size: const Size(32, 22),
                      painter: _MiniHatPainter(),
                    ),
                  ),
                ),
                // QR
                QrImageView(
                  data: 'CORPOSANPEDRO:$logisticoId',
                  version: QrVersions.auto,
                  size: 220,
                  backgroundColor: AppColors.white,
                  eyeStyle: const QrEyeStyle(
                    eyeShape: QrEyeShape.square,
                    color: AppColors.darkBrown,
                  ),
                  dataModuleStyle: const QrDataModuleStyle(
                    dataModuleShape: QrDataModuleShape.square,
                    color: AppColors.darkBrown,
                  ),
                ),
              ],
            ),
          ),
          // Texto debajo del QR
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            child: Text(
              'Presenta este código al administrador al ingresar y al salir',
              style: GoogleFonts.inter(
                fontSize: 12,
                color: AppColors.grayBrown,
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniHatPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.gold
      ..style = PaintingStyle.fill;

    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(size.width / 2, size.height * 0.8),
        width: size.width,
        height: size.height * 0.3,
      ),
      paint,
    );

    final crownPath = Path();
    crownPath.moveTo(size.width * 0.28, size.height * 0.68);
    crownPath.cubicTo(
        size.width * 0.26, size.height * 0.3, size.width * 0.3, 0, size.width * 0.5, 0);
    crownPath.cubicTo(
        size.width * 0.7, 0, size.width * 0.74, size.height * 0.3, size.width * 0.72, size.height * 0.68);
    crownPath.close();
    canvas.drawPath(crownPath, paint);
  }

  @override
  bool shouldRepaint(_MiniHatPainter old) => false;
}
