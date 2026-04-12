import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/evento_resumen.dart';
import '../../../state/app_state.dart';
import '../../auth/screens/login_screen.dart';
import '../../scanner/screens/scanner_shell.dart';

class EventosScreen extends StatefulWidget {
  const EventosScreen({super.key});

  @override
  State<EventosScreen> createState() => _EventosScreenState();
}

class _EventosScreenState extends State<EventosScreen> {
  List<EventoResumen> _eventos = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final eventos = await AppState.of(context).eventoService.getEventosActivos();
      if (!mounted) return;
      setState(() { _eventos = eventos; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  void _seleccionarEvento(EventoResumen evento) {
    AppState.of(context).setEvento(evento);
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const ScannerShell()),
    );
  }

  Future<void> _logout() async {
    final state = AppState.of(context);
    await state.authService.logout();
    state.clearSession();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final auditor = AppState.of(context).auditor;

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(auditor?.nombre ?? ''),
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation(AppColors.primary),
                    ),
                  )
                : RefreshIndicator(
                    color: AppColors.primary,
                    onRefresh: _load,
                    child: _buildBody(),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(String nombre) {
    return Container(
      color: AppColors.primary,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        left: 20,
        right: 16,
        bottom: 20,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Selecciona un evento',
                  style: GoogleFonts.montserrat(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
                if (nombre.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    nombre,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.white.withOpacity(0.75),
                    ),
                  ),
                ],
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.white),
            onPressed: _logout,
            tooltip: 'Cerrar sesión',
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.wifi_off, size: 48, color: AppColors.grayBrown),
              const SizedBox(height: 14),
              Text(_error!,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                      fontSize: 14, color: AppColors.grayBrown)),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: _load,
                child: Text('Reintentar',
                    style: GoogleFonts.montserrat(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary)),
              ),
            ],
          ),
        ),
      );
    }

    if (_eventos.isEmpty) {
      return ListView(
        children: [
          const SizedBox(height: 80),
          Center(
            child: Column(
              children: [
                Icon(Icons.event_busy,
                    size: 56, color: AppColors.grayBrown.withOpacity(0.5)),
                const SizedBox(height: 16),
                Text(
                  'No hay eventos activos',
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.grayBrown,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Desliza hacia abajo para actualizar',
                  style: GoogleFonts.inter(
                      fontSize: 13, color: AppColors.grayBrown),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
      itemCount: _eventos.length,
      itemBuilder: (_, i) => _EventoCard(
        evento: _eventos[i],
        onTap: () => _seleccionarEvento(_eventos[i]),
      ),
    );
  }
}

class _EventoCard extends StatelessWidget {
  final EventoResumen evento;
  final VoidCallback onTap;

  const _EventoCard({required this.evento, required this.onTap});

  Color get _estadoColor {
    switch (evento.estado.toUpperCase()) {
      case 'EN_CURSO':
        return AppColors.green;
      case 'EN_PREPARACION':
        return AppColors.gold;
      default:
        return AppColors.grayBrown;
    }
  }

  String get _estadoLabel {
    switch (evento.estado.toUpperCase()) {
      case 'EN_CURSO':
        return 'EN CURSO';
      case 'EN_PREPARACION':
        return 'EN PREPARACIÓN';
      case 'PLANEADO':
        return 'PLANEADO';
      default:
        return evento.estado;
    }
  }

  @override
  Widget build(BuildContext context) {
    final fecha = DateFormat('d MMM y – HH:mm', 'es').format(evento.fechaInicio);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(color: _estadoColor, width: 4),
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.darkBrown.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _estadoColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            _estadoLabel,
                            style: GoogleFonts.montserrat(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: _estadoColor,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      evento.nombre,
                      style: GoogleFonts.montserrat(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.darkBrown,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined,
                            size: 12, color: AppColors.grayBrown),
                        const SizedBox(width: 4),
                        Text(
                          fecha,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppColors.grayBrown,
                          ),
                        ),
                      ],
                    ),
                    if (evento.ubicacion != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on_outlined,
                              size: 12, color: AppColors.grayBrown),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              evento.ubicacion!,
                              style: GoogleFonts.inter(
                                  fontSize: 12, color: AppColors.grayBrown),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.people_outline,
                            size: 12, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(
                          '${evento.totalAsignados}'
                          '${evento.limitePersonal != null ? ' / ${evento.limitePersonal}' : ''}'
                          ' asignados',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Icon(
                Icons.chevron_right,
                color: AppColors.grayBrown.withOpacity(0.6),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
