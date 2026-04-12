import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class CorpoSanpedroLogo extends StatelessWidget {
  final bool darkMode;
  final double scale;

  const CorpoSanpedroLogo({
    super.key,
    this.darkMode = false,
    this.scale = 1.0,
  });

  @override
  Widget build(BuildContext context) {
    final textColor = darkMode ? AppColors.white : AppColors.darkBrown;
    final accentColor = darkMode ? AppColors.gold : AppColors.primary;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Image.asset(
          'assets/images/logo_corposanpedro.png',
          height: 72 * scale,
        ),
        const SizedBox(height: 8),
        Text(
          'CorpoSanpedro',
          style: GoogleFonts.montserrat(
            fontSize: 22 * scale,
            fontWeight: FontWeight.w800,
            color: textColor,
            letterSpacing: 0.5,
          ),
        ),
        Text(
          'Festival San Pedro del Huila',
          style: GoogleFonts.inter(
            fontSize: 12 * scale,
            fontWeight: FontWeight.w400,
            color: textColor.withOpacity(0.7),
            letterSpacing: 0.3,
          ),
        ),
      ],
    );
  }
}

class CorpoSanpedroLogoSmall extends StatelessWidget {
  final bool darkMode;

  const CorpoSanpedroLogoSmall({super.key, this.darkMode = true});

  @override
  Widget build(BuildContext context) {
    final textColor = darkMode ? AppColors.white : AppColors.darkBrown;
    final accentColor = darkMode ? AppColors.gold : AppColors.primary;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Image.asset(
          'assets/images/logo_corposanpedro.png',
          height: 28,
        ),
        const SizedBox(width: 8),
        Text(
          'CorpoSanpedro',
          style: GoogleFonts.montserrat(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: textColor,
          ),
        ),
      ],
    );
  }
}

class _HatIcon extends StatelessWidget {
  final Color color;
  final double size;

  const _HatIcon({required this.color, required this.size});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size * 0.65),
      painter: _SombreropainterVaquero(color: color),
    );
  }
}

class _SombreropainterVaquero extends CustomPainter {
  final Color color;
  const _SombreropainterVaquero({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final w = size.width;
    final h = size.height;

    // Ala del sombrero (brim)
    final brimPath = Path();
    brimPath.moveTo(0, h * 0.72);
    brimPath.cubicTo(w * 0.1, h * 0.62, w * 0.3, h * 0.58, w * 0.5, h * 0.58);
    brimPath.cubicTo(w * 0.7, h * 0.58, w * 0.9, h * 0.62, w, h * 0.72);
    brimPath.cubicTo(w * 0.9, h * 0.82, w * 0.7, h * 0.88, w * 0.5, h * 0.88);
    brimPath.cubicTo(w * 0.3, h * 0.88, w * 0.1, h * 0.82, 0, h * 0.72);
    canvas.drawPath(brimPath, paint);

    // Copa del sombrero (crown)
    final crownPath = Path();
    crownPath.moveTo(w * 0.28, h * 0.6);
    crownPath.cubicTo(w * 0.26, h * 0.38, w * 0.3, h * 0.1, w * 0.5, h * 0.05);
    crownPath.cubicTo(w * 0.7, h * 0.1, w * 0.74, h * 0.38, w * 0.72, h * 0.6);
    crownPath.close();
    canvas.drawPath(crownPath, paint);

    // Detalle cinta (hatband)
    final bandPaint = Paint()
      ..color = color.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = h * 0.07;
    canvas.drawLine(
      Offset(w * 0.285, h * 0.57),
      Offset(w * 0.715, h * 0.57),
      bandPaint,
    );
  }

  @override
  bool shouldRepaint(_SombreropainterVaquero old) => old.color != color;
}
