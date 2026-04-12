import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/corposanpedro_logo.dart';
import '../../../core/widgets/event_card.dart';
import '../../../models/evento.dart';
import '../../../models/logistico.dart';
import '../../../state/app_state.dart';
import '../../auth/screens/login_screen.dart';
import '../../shell/main_shell.dart';
import '../../events/screens/event_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Evento> _eventos = [];
  bool _loading = true;
  String? _error;

  String get _fechaActual {
    final now = DateTime.now();
    final dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    final meses = [
      '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    return '${dias[now.weekday % 7]}, ${now.day} de ${meses[now.month]}';
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadEventos());
  }

  Future<void> _loadEventos() async {
    final state = AppState.of(context);
    final logistico = state.logistico;
    if (logistico == null) return;

    setState(() { _loading = true; _error = null; });
    try {
      final eventos = await state.eventoService
          .getEventosDePersonal(int.parse(logistico.id));
      if (!mounted) return;
      setState(() { _eventos = eventos; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  @override
  Widget build(BuildContext context) {
    final logistico = AppState.of(context).logistico;
    if (logistico == null) return const SizedBox.shrink();

    final activos = _eventos
        .where((e) => e.estado == EstadoEvento.proximo || e.estado == EstadoEvento.enCurso)
        .toList();
    final proximo = activos.isNotEmpty ? activos.first : null;
    final lista = activos.take(3).toList();

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: _loadEventos,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: _Header(nombre: logistico.nombre, fechaActual: _fechaActual),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),
                    if (_loading)
                      const _LoadingCard()
                    else if (_error != null)
                      _ErrorCard(message: _error!, onRetry: _loadEventos)
                    else if (proximo != null)
                      _ProximoEventoCard(evento: proximo)
                    else
                      const _EmptyEventoCard(),
                    const SizedBox(height: 28),
                    Text(
                      'MIS EVENTOS ASIGNADOS',
                      style: GoogleFonts.montserrat(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.darkBrown,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 14),
                    if (_loading)
                      const _ShimmerList()
                    else
                      ...lista.map((e) => EventCard(
                            evento: e,
                            compact: true,
                            onTap: () => Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => EventDetailScreen(evento: e),
                              ),
                            ),
                          )),
                    const SizedBox(height: 4),
                    GestureDetector(
                      onTap: () => MainShell.of(context)?.navigateTo(2),
                      child: Text(
                        'Ver todos mis eventos →',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Header
// ──────────────────────────────────────────────────────────────────────────────

class _Header extends StatelessWidget {
  final String nombre;
  final String fechaActual;

  const _Header({required this.nombre, required this.fechaActual});

  void _showProfileSheet(BuildContext context) {
    final logistico = AppState.of(context).logistico;
    if (logistico == null) return;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _ProfileBottomSheet(logistico: logistico),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.primary,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        left: 20,
        right: 20,
        bottom: 28,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CorpoSanpedroLogoSmall(darkMode: true),
          const Spacer(),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Hola, ${nombre.split(' ').first}',
                style: GoogleFonts.montserrat(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                fechaActual,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppColors.white.withOpacity(0.7),
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: () => _showProfileSheet(context),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.white, width: 2),
                color: AppColors.darkBrown,
              ),
              child: Center(
                child: Text(
                  nombre.split(' ').map((p) => p[0]).take(2).join(),
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Tarjeta próximo evento
// ──────────────────────────────────────────────────────────────────────────────

class _ProximoEventoCard extends StatelessWidget {
  final Evento evento;
  const _ProximoEventoCard({required this.evento});

  String get _fechaFormatted {
    final months = [
      '', 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    return '${evento.fecha.day} de ${months[evento.fecha.month]}, ${evento.fecha.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.darkBrown,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.30),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            top: -6,
            right: -6,
            child: Opacity(
              opacity: 0.18,
              child: CustomPaint(
                size: const Size(72, 50),
                painter: _HatDecoPainter(),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'PRÓXIMO EVENTO',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.gold,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                evento.nombre,
                style: GoogleFonts.montserrat(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
              const SizedBox(height: 12),
              _InfoRow(
                icon: Icons.calendar_today_outlined,
                text: '$_fechaFormatted · ${evento.horaInicio}',
              ),
              const SizedBox(height: 6),
              _InfoRow(
                icon: Icons.location_on_outlined,
                text: evento.ubicacion,
              ),
              const SizedBox(height: 18),
              GestureDetector(
                onTap: () => MainShell.of(context)?.navigateTo(1),
                child: Container(
                  width: double.infinity,
                  height: 46,
                  decoration: BoxDecoration(
                    color: AppColors.gold,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.qr_code, color: AppColors.darkBrown, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          'Ver mi QR',
                          style: GoogleFonts.montserrat(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppColors.darkBrown,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _EmptyEventoCard extends StatelessWidget {
  const _EmptyEventoCard();
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.darkBrown,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          const Icon(Icons.event_available, color: AppColors.gold, size: 36),
          const SizedBox(height: 10),
          Text(
            'No tienes eventos próximos',
            style: GoogleFonts.montserrat(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class _LoadingCard extends StatelessWidget {
  const _LoadingCard();
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 180,
      decoration: BoxDecoration(
        color: AppColors.darkBrown.withOpacity(0.3),
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation(AppColors.gold),
        ),
      ),
    );
  }
}

class _ErrorCard extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorCard({required this.message, required this.onRetry});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.darkBrown,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          const Icon(Icons.wifi_off, color: AppColors.gold, size: 32),
          const SizedBox(height: 8),
          Text(
            message,
            style: GoogleFonts.inter(fontSize: 13, color: AppColors.white),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: onRetry,
            child: Text(
              'Reintentar',
              style: GoogleFonts.montserrat(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.gold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ShimmerList extends StatelessWidget {
  const _ShimmerList();
  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(
        2,
        (_) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          height: 72,
          decoration: BoxDecoration(
            color: AppColors.beige,
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  const _InfoRow({required this.icon, required this.text});
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.white.withOpacity(0.7)),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.inter(
              fontSize: 13,
              color: AppColors.white.withOpacity(0.8),
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Profile Bottom Sheet
// ──────────────────────────────────────────────────────────────────────────────

class _ProfileBottomSheet extends StatelessWidget {
  final Logistico logistico;
  const _ProfileBottomSheet({required this.logistico});

  @override
  Widget build(BuildContext context) {
    final initials = logistico.nombre
        .split(' ')
        .map((p) => p[0])
        .take(2)
        .join();

    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.beige,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.gold, width: 3),
              color: AppColors.darkBrown,
            ),
            child: Center(
              child: Text(
                initials,
                style: GoogleFonts.montserrat(
                  fontSize: 26,
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
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: AppColors.darkBrown,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            logistico.cargo,
            style: GoogleFonts.inter(fontSize: 13, color: AppColors.grayBrown),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.beige,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'ID: ${logistico.id}',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.darkBrown,
              ),
            ),
          ),
          const SizedBox(height: 28),
          const Divider(height: 1, color: AppColors.beige),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: AppColors.beige,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.badge_outlined,
                      size: 18, color: AppColors.darkBrown),
                ),
                const SizedBox(width: 14),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Documento de identidad',
                      style: GoogleFonts.inter(
                          fontSize: 11, color: AppColors.grayBrown),
                    ),
                    Text(
                      logistico.documento,
                      style: GoogleFonts.montserrat(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.darkBrown,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.beige),
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
            child: GestureDetector(
              onTap: () async {
                final state = AppState.of(context);
                await state.authService.logout();
                state.clearSession();
                if (!context.mounted) return;
                Navigator.of(context).pop();
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (_) => false,
                );
              },
              child: Container(
                height: 52,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.primary.withOpacity(0.25),
                    width: 1,
                  ),
                ),
                child: Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.logout, color: AppColors.primary, size: 20),
                      const SizedBox(width: 10),
                      Text(
                        'Cerrar sesión',
                        style: GoogleFonts.montserrat(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 24),
        ],
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Painters
// ──────────────────────────────────────────────────────────────────────────────

class _HatDecoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.gold
      ..style = PaintingStyle.fill;
    final w = size.width;
    final h = size.height;
    canvas.drawOval(Rect.fromCenter(
      center: Offset(w * 0.5, h * 0.75),
      width: w,
      height: h * 0.3,
    ), paint);
    final cp = Path();
    cp.moveTo(w * 0.25, h * 0.6);
    cp.cubicTo(w * 0.23, h * 0.3, w * 0.28, h * 0.05, w * 0.5, 0);
    cp.cubicTo(w * 0.72, h * 0.05, w * 0.77, h * 0.3, w * 0.75, h * 0.6);
    cp.close();
    canvas.drawPath(cp, paint);
  }

  @override
  bool shouldRepaint(_HatDecoPainter old) => false;
}
