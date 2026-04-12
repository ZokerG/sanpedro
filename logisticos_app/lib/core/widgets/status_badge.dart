import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../../models/evento.dart';
import '../../models/pago.dart';

class EventoStatusBadge extends StatelessWidget {
  final EstadoEvento estado;
  final bool small;

  const EventoStatusBadge({super.key, required this.estado, this.small = false});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color textColor;

    switch (estado) {
      case EstadoEvento.proximo:
        bg = AppColors.gold.withOpacity(0.15);
        textColor = AppColors.gold;
        break;
      case EstadoEvento.enCurso:
        bg = AppColors.green.withOpacity(0.12);
        textColor = AppColors.green;
        break;
      case EstadoEvento.liquidacion:
        bg = AppColors.primary.withOpacity(0.12);
        textColor = AppColors.primary;
        break;
      case EstadoEvento.finalizado:
        bg = AppColors.grayBrown.withOpacity(0.15);
        textColor = AppColors.grayBrown;
        break;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 10,
        vertical: small ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        estado.label,
        style: GoogleFonts.inter(
          fontSize: small ? 10 : 11,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }
}

class PagoStatusBadge extends StatelessWidget {
  final EstadoPago estado;

  const PagoStatusBadge({super.key, required this.estado});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color textColor;

    switch (estado) {
      case EstadoPago.pendiente:
        bg = AppColors.badgePendingBg;
        textColor = AppColors.gold;
        break;
      case EstadoPago.enLiquidacion:
        bg = AppColors.badgeLiquidacionBg;
        textColor = AppColors.primary;
        break;
      case EstadoPago.pagado:
        bg = AppColors.badgePagadoBg;
        textColor = AppColors.green;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        estado.label,
        style: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: textColor,
        ),
      ),
    );
  }
}
