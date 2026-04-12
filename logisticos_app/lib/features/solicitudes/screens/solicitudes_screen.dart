import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/evento.dart';
import '../../../models/solicitud.dart';
import '../../../state/app_state.dart';

class SolicitudesScreen extends StatefulWidget {
  const SolicitudesScreen({super.key});

  @override
  State<SolicitudesScreen> createState() => _SolicitudesScreenState();
}

class _SolicitudesScreenState extends State<SolicitudesScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  List<Evento> _disponibles = [];
  List<Solicitud> _misSolicitudes = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final state = AppState.of(context);
    final id = int.parse(state.logistico?.id ?? '0');
    setState(() { _loading = true; _error = null; });
    try {
      final results = await Future.wait([
        state.solicitudService.getEventosDisponibles(id),
        state.solicitudService.getMisSolicitudes(id),
      ]);
      if (!mounted) return;
      setState(() {
        _disponibles = results[0] as List<Evento>;
        _misSolicitudes = results[1] as List<Solicitud>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(context),
          if (!_loading && _error == null)
            _buildTabBar(),
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation(AppColors.primary),
                    ),
                  )
                : _error != null
                    ? _buildError()
                    : TabBarView(
                        controller: _tabController,
                        children: [
                          _EventosDisponiblesTab(
                            eventos: _disponibles,
                            onSolicitar: _confirmarSolicitud,
                          ),
                          _MisSolicitudesTab(
                            solicitudes: _misSolicitudes,
                            onCancelar: _cancelarSolicitud,
                          ),
                        ],
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
        bottom: 16,
      ),
      child: Row(
        children: [
          Text(
            'Solicitudes',
            style: GoogleFonts.montserrat(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
          const Spacer(),
          GestureDetector(
            onTap: _load,
            child: const Icon(Icons.refresh, color: AppColors.white, size: 22),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBar() {
    return Container(
      color: AppColors.primary,
      child: TabBar(
        controller: _tabController,
        indicatorColor: AppColors.gold,
        indicatorWeight: 3,
        labelStyle: GoogleFonts.montserrat(
          fontSize: 13,
          fontWeight: FontWeight.w700,
        ),
        unselectedLabelStyle: GoogleFonts.inter(fontSize: 13),
        labelColor: AppColors.white,
        unselectedLabelColor: AppColors.white.withOpacity(0.6),
        tabs: [
          Tab(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.search, size: 16),
                const SizedBox(width: 6),
                const Text('Disponibles'),
                if (_disponibles.isNotEmpty) ...[
                  const SizedBox(width: 6),
                  _CountBadge(count: _disponibles.length),
                ],
              ],
            ),
          ),
          Tab(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.assignment_outlined, size: 16),
                const SizedBox(width: 6),
                const Text('Mis solicitudes'),
                if (_misSolicitudes.isNotEmpty) ...[
                  const SizedBox(width: 6),
                  _CountBadge(count: _misSolicitudes.length),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 48, color: AppColors.grayBrown),
            const SizedBox(height: 14),
            Text(
              _error!,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 14, color: AppColors.grayBrown),
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _load,
              child: Text(
                'Reintentar',
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmarSolicitud(Evento evento) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => _SolicitarSheet(
        evento: evento,
        onConfirmar: (rolAsignado) async {
          Navigator.of(context).pop();
          await _enviarSolicitud(evento, rolAsignado);
        },
      ),
    );
  }

  Future<void> _enviarSolicitud(Evento evento, String? rolAsignado) async {
    final state = AppState.of(context);
    final id = int.parse(state.logistico?.id ?? '0');
    try {
      await state.solicitudService.crearSolicitud(id, int.parse(evento.id),
          rolAsignado: rolAsignado);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '¡Solicitud enviada para ${evento.nombre}!',
            style: GoogleFonts.inter(color: AppColors.white),
          ),
          backgroundColor: AppColors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      _load(); // Recargar para actualizar listas
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString(), style: GoogleFonts.inter(color: AppColors.white)),
          backgroundColor: AppColors.primary,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  void _cancelarSolicitud(Solicitud solicitud) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Cancelar solicitud',
          style: GoogleFonts.montserrat(
              fontWeight: FontWeight.w700, color: AppColors.darkBrown),
        ),
        content: Text(
          '¿Deseas cancelar tu solicitud para "${solicitud.eventoNombre}"?',
          style: GoogleFonts.inter(color: AppColors.darkBrown),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text('No', style: GoogleFonts.inter(color: AppColors.grayBrown)),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(
              'Sí, cancelar',
              style: GoogleFonts.montserrat(
                  fontWeight: FontWeight.w700, color: AppColors.primary),
            ),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      final state = AppState.of(context);
      await state.solicitudService.cancelarSolicitud(solicitud.id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Solicitud cancelada',
              style: GoogleFonts.inter(color: AppColors.white)),
          backgroundColor: AppColors.darkBrown,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      _load();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString(), style: GoogleFonts.inter(color: AppColors.white)),
          backgroundColor: AppColors.primary,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Tab 1 — Eventos disponibles
// ──────────────────────────────────────────────────────────────────────────────

class _EventosDisponiblesTab extends StatelessWidget {
  final List<Evento> eventos;
  final void Function(Evento) onSolicitar;

  const _EventosDisponiblesTab({
    required this.eventos,
    required this.onSolicitar,
  });

  @override
  Widget build(BuildContext context) {
    if (eventos.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.event_available,
                size: 56, color: AppColors.grayBrown.withOpacity(0.4)),
            const SizedBox(height: 16),
            Text(
              'No hay eventos disponibles\npara solicitar en este momento',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 14, color: AppColors.grayBrown),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
      itemCount: eventos.length,
      itemBuilder: (context, i) => _EventoDisponibleCard(
        evento: eventos[i],
        onSolicitar: () => onSolicitar(eventos[i]),
      ),
    );
  }
}

class _EventoDisponibleCard extends StatelessWidget {
  final Evento evento;
  final VoidCallback onSolicitar;

  const _EventoDisponibleCard({required this.evento, required this.onSolicitar});

  String get _fechaFormatted {
    final months = [
      '', 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    return '${evento.fecha.day} ${months[evento.fecha.month]}, ${evento.fecha.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.07),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Franja dorada superior
          Container(
            height: 4,
            decoration: const BoxDecoration(
              color: AppColors.gold,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  evento.nombre,
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkBrown,
                  ),
                ),
                const SizedBox(height: 10),
                _InfoRow(
                  icon: Icons.calendar_today_outlined,
                  text: '$_fechaFormatted · ${evento.horaInicio}',
                ),
                const SizedBox(height: 5),
                _InfoRow(
                  icon: Icons.location_on_outlined,
                  text: evento.ubicacion,
                ),
                if (evento.tarifa > 0) ...[
                  const SizedBox(height: 5),
                  _InfoRow(
                    icon: Icons.account_balance_wallet_outlined,
                    text: '\$${evento.tarifa.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                    textColor: AppColors.green,
                  ),
                ],
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: GestureDetector(
                    onTap: onSolicitar,
                    child: Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.28),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.send_outlined,
                                color: AppColors.white, size: 16),
                            const SizedBox(width: 8),
                            Text(
                              'Solicitar participación',
                              style: GoogleFonts.montserrat(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Tab 2 — Mis solicitudes
// ──────────────────────────────────────────────────────────────────────────────

class _MisSolicitudesTab extends StatelessWidget {
  final List<Solicitud> solicitudes;
  final void Function(Solicitud) onCancelar;

  const _MisSolicitudesTab({
    required this.solicitudes,
    required this.onCancelar,
  });

  @override
  Widget build(BuildContext context) {
    if (solicitudes.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.assignment_outlined,
                size: 56, color: AppColors.grayBrown.withOpacity(0.4)),
            const SizedBox(height: 16),
            Text(
              'Aún no has enviado solicitudes',
              style: GoogleFonts.inter(fontSize: 14, color: AppColors.grayBrown),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
      itemCount: solicitudes.length,
      itemBuilder: (context, i) => _SolicitudCard(
        solicitud: solicitudes[i],
        onCancelar: solicitudes[i].estado == EstadoSolicitud.pendiente
            ? () => onCancelar(solicitudes[i])
            : null,
      ),
    );
  }
}

class _SolicitudCard extends StatelessWidget {
  final Solicitud solicitud;
  final VoidCallback? onCancelar;

  const _SolicitudCard({required this.solicitud, this.onCancelar});

  Color get _barColor {
    switch (solicitud.estado) {
      case EstadoSolicitud.pendiente:
        return AppColors.gold;
      case EstadoSolicitud.aprobada:
        return AppColors.green;
      case EstadoSolicitud.rechazada:
        return AppColors.primary;
      case EstadoSolicitud.cancelada:
        return AppColors.grayBrown;
    }
  }

  String get _fechaFormatted {
    final d = solicitud.fechaSolicitud;
    final months = [
      '', 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    return '${d.day} ${months[d.month]} ${d.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
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
            // Franja lateral coloreada
            Container(
              width: 4,
              decoration: BoxDecoration(
                color: _barColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  bottomLeft: Radius.circular(14),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            solicitud.eventoNombre,
                            style: GoogleFonts.montserrat(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.darkBrown,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        _EstadoBadge(estado: solicitud.estado),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(Icons.calendar_today_outlined,
                            size: 12, color: AppColors.grayBrown),
                        const SizedBox(width: 4),
                        Text(
                          'Solicitado el $_fechaFormatted',
                          style: GoogleFonts.inter(
                              fontSize: 11, color: AppColors.grayBrown),
                        ),
                      ],
                    ),
                    if (solicitud.rolAsignado != null &&
                        solicitud.rolAsignado!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.work_outline,
                              size: 12, color: AppColors.grayBrown),
                          const SizedBox(width: 4),
                          Text(
                            solicitud.rolAsignado!,
                            style: GoogleFonts.inter(
                                fontSize: 11, color: AppColors.grayBrown),
                          ),
                        ],
                      ),
                    ],
                    if (solicitud.estado == EstadoSolicitud.rechazada &&
                        solicitud.notaRechazo != null) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.info_outline,
                                size: 14, color: AppColors.primary),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                solicitud.notaRechazo!,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    if (onCancelar != null) ...[
                      const SizedBox(height: 10),
                      GestureDetector(
                        onTap: onCancelar,
                        child: Text(
                          'Cancelar solicitud',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppColors.grayBrown,
                            decoration: TextDecoration.underline,
                            decorationColor: AppColors.grayBrown,
                          ),
                        ),
                      ),
                    ],
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
// Bottom sheet para solicitar con rol opcional
// ──────────────────────────────────────────────────────────────────────────────

class _SolicitarSheet extends StatefulWidget {
  final Evento evento;
  final void Function(String? rolAsignado) onConfirmar;

  const _SolicitarSheet({required this.evento, required this.onConfirmar});

  @override
  State<_SolicitarSheet> createState() => _SolicitarSheetState();
}

class _SolicitarSheetState extends State<_SolicitarSheet> {
  final _rolCtrl = TextEditingController();

  @override
  void dispose() {
    _rolCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.beige,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Solicitar participación',
              style: GoogleFonts.montserrat(
                fontSize: 17,
                fontWeight: FontWeight.w700,
                color: AppColors.darkBrown,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              widget.evento.nombre,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppColors.grayBrown,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Rol o función (opcional)',
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.darkBrown,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: AppColors.beige,
                borderRadius: BorderRadius.circular(12),
              ),
              child: TextField(
                controller: _rolCtrl,
                style: GoogleFonts.inter(
                    fontSize: 14, color: AppColors.darkBrown),
                decoration: InputDecoration(
                  hintText: 'Ej: Logística de entrada, Montaje...',
                  hintStyle: GoogleFonts.inter(
                      fontSize: 14, color: AppColors.grayBrown),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                ),
              ),
            ),
            const SizedBox(height: 24),
            GestureDetector(
              onTap: () =>
                  widget.onConfirmar(_rolCtrl.text.trim().isEmpty ? null : _rolCtrl.text.trim()),
              child: Container(
                width: double.infinity,
                height: 52,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.30),
                      blurRadius: 14,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    'Enviar solicitud',
                    style: GoogleFonts.montserrat(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                  ),
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
// Widgets auxiliares
// ──────────────────────────────────────────────────────────────────────────────

class _CountBadge extends StatelessWidget {
  final int count;
  const _CountBadge({required this.count});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.gold,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        '$count',
        style: GoogleFonts.montserrat(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: AppColors.darkBrown,
        ),
      ),
    );
  }
}

class _EstadoBadge extends StatelessWidget {
  final EstadoSolicitud estado;
  const _EstadoBadge({required this.estado});

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color text;
    switch (estado) {
      case EstadoSolicitud.pendiente:
        bg = AppColors.gold.withOpacity(0.15);
        text = AppColors.gold;
        break;
      case EstadoSolicitud.aprobada:
        bg = AppColors.green.withOpacity(0.12);
        text = AppColors.green;
        break;
      case EstadoSolicitud.rechazada:
        bg = AppColors.primary.withOpacity(0.12);
        text = AppColors.primary;
        break;
      case EstadoSolicitud.cancelada:
        bg = AppColors.grayBrown.withOpacity(0.12);
        text = AppColors.grayBrown;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        estado.label,
        style: GoogleFonts.inter(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: text,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color? textColor;
  const _InfoRow({required this.icon, required this.text, this.textColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 13, color: AppColors.grayBrown),
        const SizedBox(width: 5),
        Expanded(
          child: Text(
            text,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: textColor ?? AppColors.grayBrown,
              fontWeight:
                  textColor != null ? FontWeight.w600 : FontWeight.w400,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
