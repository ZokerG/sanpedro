import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../../models/evento.dart';
import 'status_badge.dart';

class EventCard extends StatelessWidget {
  final Evento evento;
  final VoidCallback? onTap;
  final bool compact;

  const EventCard({
    super.key,
    required this.evento,
    this.onTap,
    this.compact = false,
  });

  Color get _borderColor {
    switch (evento.estado) {
      case EstadoEvento.proximo:
        return AppColors.gold;
      case EstadoEvento.enCurso:
        return AppColors.green;
      case EstadoEvento.liquidacion:
        return AppColors.primary;
      case EstadoEvento.finalizado:
        return AppColors.grayBrown;
    }
  }

  String get _fechaFormatted {
    final months = [
      '', 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    return '${evento.fecha.day} ${months[evento.fecha.month]}, ${evento.fecha.year}';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.darkBrown.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Franja lateral izquierda
              Container(
                width: 4,
                decoration: BoxDecoration(
                  color: _borderColor,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(14),
                    bottomLeft: Radius.circular(14),
                  ),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: compact ? 10 : 14,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              evento.nombre,
                              style: GoogleFonts.montserrat(
                                fontSize: compact ? 13 : 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.darkBrown,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 5),
                            Row(
                              children: [
                                Icon(
                                  Icons.calendar_today_outlined,
                                  size: 12,
                                  color: AppColors.grayBrown,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '$_fechaFormatted · ${evento.horaInicio}',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: AppColors.grayBrown,
                                  ),
                                ),
                              ],
                            ),
                            if (!compact) ...[
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(
                                    Icons.location_on_outlined,
                                    size: 12,
                                    color: AppColors.grayBrown,
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      evento.ubicacion,
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: AppColors.grayBrown,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          EventoStatusBadge(estado: evento.estado, small: true),
                          if (onTap != null)
                            Icon(
                              Icons.chevron_right,
                              color: AppColors.grayBrown,
                              size: 20,
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
