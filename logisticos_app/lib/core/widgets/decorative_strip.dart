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
      size: const Size(180, 180),
      painter: _BigSombreroPainter(),
    );
  }
}

class _BigSombreroPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary.withOpacity(0.10)
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // Ala del sombrero (brim) — grande y pronunciada
    final brimPath = Path();
    brimPath.moveTo(0, h * 0.72);
    brimPath.cubicTo(w * 0.08, h * 0.58, w * 0.28, h * 0.52, w * 0.5, h * 0.52);
    brimPath.cubicTo(w * 0.72, h * 0.52, w * 0.92, h * 0.58, w, h * 0.72);
    brimPath.cubicTo(w * 0.9, h * 0.86, w * 0.7, h * 0.94, w * 0.5, h * 0.94);
    brimPath.cubicTo(w * 0.3, h * 0.94, w * 0.1, h * 0.86, 0, h * 0.72);
    canvas.drawPath(brimPath, paint);

    // Copa del sombrero (crown)
    final crownPath = Path();
    crownPath.moveTo(w * 0.24, h * 0.54);
    crownPath.cubicTo(w * 0.22, h * 0.30, w * 0.28, h * 0.04, w * 0.5, h * 0.02);
    crownPath.cubicTo(w * 0.72, h * 0.04, w * 0.78, h * 0.30, w * 0.76, h * 0.54);
    crownPath.close();
    canvas.drawPath(crownPath, paint);

    // Cinta del sombrero (hatband)
    final bandPaint = Paint()
      ..color = AppColors.primary.withOpacity(0.07)
      ..style = PaintingStyle.stroke
      ..strokeWidth = h * 0.06;
    canvas.drawLine(
      Offset(w * 0.245, h * 0.51),
      Offset(w * 0.755, h * 0.51),
      bandPaint,
    );
  }

  @override
  bool shouldRepaint(_BigSombreroPainter old) => false;
}
