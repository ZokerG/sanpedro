import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/status_badge.dart';
import '../../../models/evento.dart';
import '../../shell/main_shell.dart';
import '../../payments/screens/cuenta_cobro_screen.dart';

class EventDetailScreen extends StatelessWidget {
  final Evento evento;

  const EventDetailScreen({super.key, required this.evento});

  String get _fechaCompleta {
    final dias = [
      'domingo', 'lunes', 'martes', 'miércoles',
      'jueves', 'viernes', 'sábado'
    ];
    final meses = [
      '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return '${dias[evento.fecha.weekday % 7]}, ${evento.fecha.day} de ${meses[evento.fecha.month]} de ${evento.fecha.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Tarjeta información del evento
                  _InfoCard(
                    evento: evento,
                    fechaCompleta: _fechaCompleta,
                  ),
                  // Registro de ingreso/salida (si aplica)
                  if (evento.horaIngresoRegistrado != null) ...[
                    const SizedBox(height: 20),
                    _RegistroCard(evento: evento),
                  ],
                  const SizedBox(height: 28),
                  // Botón Ver QR (solo en curso)
                  if (evento.estado == EstadoEvento.enCurso) ...[
                    _BotonVerQR(context: context),
                    const SizedBox(height: 12),
                  ],
                  // Botón Generar cuenta de cobro
                  _BotonCuentaCobro(
                    evento: evento,
                    context: context,
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
        top: MediaQuery.of(context).padding.top + 12,
        left: 8,
        right: 20,
        bottom: 16,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new,
                color: AppColors.white, size: 20),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(
                  evento.nombre,
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 6),
                EventoStatusBadge(estado: evento.estado),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final Evento evento;
  final String fechaCompleta;

  const _InfoCard({required this.evento, required this.fechaCompleta});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.07),
            blurRadius: 16,
            offset: const Offset(0, 5),
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
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
              ),
            ),
          ),
          Stack(
            children: [
              // Ícono decorativo sombrero
              Positioned(
                top: 8,
                right: 12,
                child: Opacity(
                  opacity: 0.12,
                  child: CustomPaint(
                    size: const Size(56, 40),
                    painter: _HatDecoPainter(),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    _DetailRow(
                      icon: Icons.calendar_today_outlined,
                      label: 'Fecha',
                      value: fechaCompleta,
                    ),
                    const Divider(height: 24, color: AppColors.beige),
                    _DetailRow(
                      icon: Icons.access_time_outlined,
                      label: 'Hora de inicio',
                      value: evento.horaInicio,
                    ),
                    const Divider(height: 24, color: AppColors.beige),
                    _DetailRow(
                      icon: Icons.location_on_outlined,
                      label: 'Lugar',
                      value: evento.ubicacion,
                    ),
                    const Divider(height: 24, color: AppColors.beige),
                    _DetailRow(
                      icon: Icons.account_balance_wallet_outlined,
                      label: 'Tarifa',
                      value:
                          '\$${evento.tarifa.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                      valueColor: AppColors.green,
                      valueBold: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;
  final bool valueBold;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
    this.valueBold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.beige,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, size: 18, color: AppColors.primary),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: AppColors.grayBrown,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  fontWeight:
                      valueBold ? FontWeight.w700 : FontWeight.w600,
                  color: valueColor ?? AppColors.darkBrown,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _RegistroCard extends StatelessWidget {
  final Evento evento;

  const _RegistroCard({required this.evento});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'MI REGISTRO EN ESTE EVENTO',
            style: GoogleFonts.montserrat(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: AppColors.darkBrown,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _RegistroItem(
                  label: 'Ingreso',
                  value: evento.horaIngresoRegistrado ?? 'Pendiente',
                  color: AppColors.green,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _RegistroItem(
                  label: 'Salida',
                  value: evento.horaSalidaRegistrada ?? 'Pendiente',
                  color: evento.horaSalidaRegistrada != null
                      ? AppColors.grayBrown
                      : AppColors.gold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RegistroItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _RegistroItem({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 11,
              color: AppColors.grayBrown,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.montserrat(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _BotonVerQR extends StatelessWidget {
  final BuildContext context;

  const _BotonVerQR({required this.context});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop();
        MainShell.of(context)?.navigateTo(1);
      },
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: AppColors.gold,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.gold.withOpacity(0.35),
              blurRadius: 14,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.qr_code, color: AppColors.darkBrown, size: 20),
              const SizedBox(width: 8),
              Text(
                'Ver mi QR',
                style: GoogleFonts.montserrat(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.darkBrown,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BotonCuentaCobro extends StatelessWidget {
  final Evento evento;
  final BuildContext context;

  const _BotonCuentaCobro({required this.evento, required this.context});

  bool get _habilitado => evento.estado == EstadoEvento.liquidacion;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _habilitado
          ? () => Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => CuentaCobroScreen(evento: evento),
                ),
              )
          : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: 52,
        decoration: BoxDecoration(
          color: _habilitado ? AppColors.primary : AppColors.grayBrown.withOpacity(0.3),
          borderRadius: BorderRadius.circular(14),
          boxShadow: _habilitado
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.30),
                    blurRadius: 14,
                    offset: const Offset(0, 5),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: _habilitado
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.receipt_long_outlined,
                        color: AppColors.white, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Generar cuenta de cobro',
                      style: GoogleFonts.montserrat(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.white,
                      ),
                    ),
                  ],
                )
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'Disponible cuando el evento entre en liquidación',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: AppColors.grayBrown,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
        ),
      ),
    );
  }
}

class _HatDecoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.gold
      ..style = PaintingStyle.fill;
    final w = size.width;
    final h = size.height;

    canvas.drawOval(Rect.fromCenter(
      center: Offset(w * 0.5, h * 0.8),
      width: w,
      height: h * 0.28,
    ), paint);

    final cp = Path();
    cp.moveTo(w * 0.26, h * 0.66);
    cp.cubicTo(w * 0.24, h * 0.3, w * 0.28, 0, w * 0.5, 0);
    cp.cubicTo(w * 0.72, 0, w * 0.76, h * 0.3, w * 0.74, h * 0.66);
    cp.close();
    canvas.drawPath(cp, paint);
  }

  @override
  bool shouldRepaint(_HatDecoPainter old) => false;
}
