import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class DecorativeStrip extends StatelessWidget {
  final double height;

  const DecorativeStrip({super.key, this.height = 60});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _GeometricStripPainter(),
      ),
    );
  }
}

class _GeometricStripPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final redPaint = Paint()..color = AppColors.primary;
    final goldPaint = Paint()..color = AppColors.gold;
    final lightPaint = Paint()..color = AppColors.primary.withOpacity(0.6);

    // Fondo rojo
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), redPaint);

    // Patrón geométrico: triángulos alternos
    const triangleWidth = 24.0;
    final count = (size.width / triangleWidth).ceil() + 1;

    for (int i = 0; i < count; i++) {
      final x = i * triangleWidth.toDouble();
      final isEven = i % 2 == 0;

      final path = Path();
      if (isEven) {
        // Triángulo apuntando arriba
        path.moveTo(x, size.height);
        path.lineTo(x + triangleWidth / 2, 0);
        path.lineTo(x + triangleWidth, size.height);
        path.close();
        canvas.drawPath(path, goldPaint..color = AppColors.gold.withOpacity(0.85));
      } else {
        // Triángulo apuntando abajo
        path.moveTo(x, 0);
        path.lineTo(x + triangleWidth / 2, size.height);
        path.lineTo(x + triangleWidth, 0);
        path.close();
        canvas.drawPath(path, lightPaint);
      }
    }

    // Pequeños rombos decorativos intercalados
    final diamondPaint = Paint()
      ..color = AppColors.gold.withOpacity(0.6)
      ..style = PaintingStyle.fill;

    for (int i = 0; i < count ~/ 2; i++) {
      final cx = (i * triangleWidth * 2) + triangleWidth;
      final cy = size.height / 2;
      const r = 4.0;
      final diamondPath = Path();
      diamondPath.moveTo(cx, cy - r);
      diamondPath.lineTo(cx + r, cy);
      diamondPath.lineTo(cx, cy + r);
      diamondPath.lineTo(cx - r, cy);
      diamondPath.close();
      canvas.drawPath(diamondPath, diamondPaint);
    }

    // Línea dorada superior
    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width, 2),
      Paint()..color = AppColors.gold,
    );
  }

  @override
  bool shouldRepaint(_GeometricStripPainter old) => false;
}

class HorseRiderDecoration extends StatelessWidget {
  const HorseRiderDecoration({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(200, 150),
      painter: _HorseRiderPainter(),
    );
  }
}

class _HorseRiderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary.withOpacity(0.08)
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // Cuerpo del caballo (simplificado)
    final bodyPath = Path();
    bodyPath.addOval(Rect.fromCenter(
      center: Offset(w * 0.5, h * 0.65),
      width: w * 0.65,
      height: h * 0.35,
    ));
    canvas.drawPath(bodyPath, paint);

    // Cuello
    final neckPath = Path();
    neckPath.moveTo(w * 0.55, h * 0.5);
    neckPath.quadraticBezierTo(w * 0.62, h * 0.28, w * 0.68, h * 0.25);
    neckPath.lineTo(w * 0.72, h * 0.32);
    neckPath.quadraticBezierTo(w * 0.66, h * 0.42, w * 0.62, h * 0.55);
    neckPath.close();
    canvas.drawPath(neckPath, paint);

    // Cabeza del caballo
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(w * 0.72, h * 0.22),
        width: w * 0.15,
        height: h * 0.14,
      ),
      paint,
    );

    // Patas
    final legPaint = Paint()
      ..color = AppColors.primary.withOpacity(0.08)
      ..strokeWidth = w * 0.04
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Pata delantera
    canvas.drawLine(
      Offset(w * 0.58, h * 0.78),
      Offset(w * 0.53, h * 0.98),
      legPaint,
    );
    // Pata trasera
    canvas.drawLine(
      Offset(w * 0.38, h * 0.78),
      Offset(w * 0.33, h * 0.98),
      legPaint,
    );
    // Pata delantera levantada
    canvas.drawLine(
      Offset(w * 0.64, h * 0.76),
      Offset(w * 0.7, h * 0.94),
      legPaint,
    );
    // Pata trasera levantada
    canvas.drawLine(
      Offset(w * 0.44, h * 0.78),
      Offset(w * 0.5, h * 0.96),
      legPaint,
    );

    // Cola
    final tailPath = Path();
    tailPath.moveTo(w * 0.2, h * 0.58);
    tailPath.cubicTo(
      w * 0.08, h * 0.45,
      w * 0.04, h * 0.62,
      w * 0.06, h * 0.78,
    );
    canvas.drawPath(
      tailPath,
      Paint()
        ..color = AppColors.primary.withOpacity(0.08)
        ..style = PaintingStyle.stroke
        ..strokeWidth = w * 0.06
        ..strokeCap = StrokeCap.round,
    );

    // Jinete (silueta simplificada)
    // Torso
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(w * 0.52, h * 0.38),
        width: w * 0.16,
        height: h * 0.22,
      ),
      paint,
    );
    // Cabeza jinete
    canvas.drawCircle(Offset(w * 0.52, h * 0.22), w * 0.065, paint);
    // Sombrero
    final hatPaint = Paint()..color = AppColors.primary.withOpacity(0.08);
    final hatPath = Path();
    hatPath.addOval(Rect.fromCenter(
      center: Offset(w * 0.52, h * 0.16),
      width: w * 0.18,
      height: h * 0.05,
    ));
    canvas.drawPath(hatPath, hatPaint);
    canvas.drawRect(
      Rect.fromCenter(
        center: Offset(w * 0.52, h * 0.12),
        width: w * 0.11,
        height: h * 0.07,
      ),
      hatPaint,
    );
  }

  @override
  bool shouldRepaint(_HorseRiderPainter old) => false;
}
