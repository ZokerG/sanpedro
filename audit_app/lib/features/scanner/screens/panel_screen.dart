import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/registro_asistencia.dart';
import '../../../state/app_state.dart';

class PanelScreen extends StatefulWidget {
  const PanelScreen({super.key});

  @override
  State<PanelScreen> createState() => _PanelScreenState();
}

class _PanelScreenState extends State<PanelScreen> {
  List<RegistroAsistencia> _registros = [];
  bool _loading = true;
  String? _error;
  Timer? _autoRefresh;

  int get _ingresos =>
      _registros.where((r) => r.esIngreso).length;
  int get _salidas =>
      _registros.where((r) => !r.esIngreso).length;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _load();
      _autoRefresh = Timer.periodic(
        const Duration(seconds: 15),
        (_) => _load(silencioso: true),
      );
    });
  }

  @override
  void dispose() {
    _autoRefresh?.cancel();
    super.dispose();
  }

  Future<void> _load({bool silencioso = false}) async {
    final evento = AppState.of(context).eventoSeleccionado;
    if (evento == null) return;

    if (!silencioso) setState(() { _loading = true; _error = null; });

    try {
      final registros = await AppState.of(context)
          .asistenciaService
          .getRegistrosPorEvento(evento.id);
      if (!mounted) return;
      setState(() {
        _registros = registros;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      if (!silencioso) setState(() { _loading = false; _error = e.toString(); });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation(AppColors.primary),
        ),
      );
    }

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

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: _load,
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: _buildStats()),
          if (_registros.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.qr_code_2,
                        size: 56,
                        color: AppColors.grayBrown.withOpacity(0.4)),
                    const SizedBox(height: 14),
                    Text(
                      'Sin registros aún',
                      style: GoogleFonts.montserrat(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.grayBrown,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Los escaneos aparecerán aquí en tiempo real',
                      style: GoogleFonts.inter(
                          fontSize: 12, color: AppColors.grayBrown),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (_, i) => _RegistroRow(registro: _registros[i]),
                  childCount: _registros.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStats() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: Row(
        children: [
          Expanded(
            child: _StatCard(
              label: 'Ingresos',
              value: _ingresos,
              color: AppColors.green,
              icon: Icons.login,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              label: 'Salidas',
              value: _salidas,
              color: AppColors.gold,
              icon: Icons.logout,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _StatCard(
              label: 'Total',
              value: _registros.length,
              color: AppColors.primary,
              icon: Icons.people_outline,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final int value;
  final Color color;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(
            '$value',
            style: GoogleFonts.montserrat(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: color.withOpacity(0.8),
            ),
          ),
        ],
      ),
    );
  }
}

class _RegistroRow extends StatelessWidget {
  final RegistroAsistencia registro;
  const _RegistroRow({required this.registro});

  @override
  Widget build(BuildContext context) {
    final esIngreso = registro.esIngreso;
    final color = esIngreso ? AppColors.green : AppColors.gold;
    final hora = DateFormat('HH:mm:ss').format(registro.timestampRegistro);
    final fecha = DateFormat('d MMM', 'es').format(registro.timestampRegistro);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 3)),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  registro.nombrePersonal,
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkBrown,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Text(
                      registro.documento,
                      style: GoogleFonts.inter(
                          fontSize: 11, color: AppColors.grayBrown),
                    ),
                    if (registro.numeroCamiseta != null) ...[
                      Text(
                        '  ·  #${registro.numeroCamiseta}',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  esIngreso ? 'INGRESO' : 'SALIDA',
                  style: GoogleFonts.montserrat(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: color,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                hora,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.darkBrown,
                ),
              ),
              Text(
                fecha,
                style: GoogleFonts.inter(
                    fontSize: 10, color: AppColors.grayBrown),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
