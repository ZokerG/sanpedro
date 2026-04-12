import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/status_badge.dart';
import '../../../models/pago.dart';
import '../../../state/app_state.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  List<Pago> _pagos = [];
  double _totalPendiente = 0;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final state = AppState.of(context);
    final logistico = state.logistico;
    if (logistico == null) return;
    setState(() { _loading = true; _error = null; });
    try {
      final cartera = await state.carteraService
          .getCarteraPersonal(int.parse(logistico.id));
      if (!mounted) return;
      setState(() {
        _pagos = cartera.registros;
        _totalPendiente = cartera.totalPendiente;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  @override
  Widget build(BuildContext context) {
    final pagos = _pagos;

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(context),
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
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
                      children: [
                        _TotalCard(total: _totalPendiente),
                        const SizedBox(height: 28),
                        if (_error != null)
                          Center(
                            child: Text(_error!,
                                style: GoogleFonts.inter(
                                    fontSize: 13, color: AppColors.grayBrown)),
                          )
                        else ...[
                          Text(
                            'MI CARTERA',
                            style: GoogleFonts.montserrat(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.darkBrown,
                              letterSpacing: 1.2,
                            ),
                          ),
                          const SizedBox(height: 14),
                          if (pagos.isEmpty)
                            Center(
                              child: Text('No hay pagos registrados',
                                  style: GoogleFonts.inter(
                                      fontSize: 14, color: AppColors.grayBrown)),
                            )
                          else
                            ...pagos.map((p) => _PagoRow(pago: p)),
                        ],
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
        top: MediaQuery.of(context).padding.top + 16,
        left: 20,
        right: 20,
        bottom: 20,
      ),
      child: Row(
        children: [
          Text(
            'Mis pagos',
            style: GoogleFonts.montserrat(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
          const Spacer(),
          const Icon(Icons.account_balance_wallet,
              color: AppColors.white, size: 24),
        ],
      ),
    );
  }
}

class _TotalCard extends StatelessWidget {
  final double total;

  const _TotalCard({required this.total});

  String _formatMoney(double amount) {
    final formatted = amount
        .toStringAsFixed(0)
        .replaceAllMapped(
          RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]}.',
        );
    return '\$$formatted';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.darkBrown,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.28),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'PENDIENTE DE COBRO',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: AppColors.white.withOpacity(0.65),
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _formatMoney(total),
            style: GoogleFonts.montserrat(
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: AppColors.gold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Genera tu cuenta de cobro para recibir el pago',
            style: GoogleFonts.inter(
              fontSize: 12,
              color: AppColors.white.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }
}

class _PagoRow extends StatelessWidget {
  final Pago pago;

  const _PagoRow({required this.pago});

  String get _fechaFormatted {
    final months = [
      '', 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    return '${pago.fechaEvento.day} ${months[pago.fechaEvento.month]} ${pago.fechaEvento.year}';
  }

  String _formatMoney(double amount) {
    return '\$${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: null,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.darkBrown.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, 3),
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
                    pago.eventoNombre,
                    style: GoogleFonts.montserrat(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.darkBrown,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _fechaFormatted,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.grayBrown,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        _formatMoney(pago.monto),
                        style: GoogleFonts.montserrat(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.green,
                        ),
                      ),
                      const SizedBox(width: 10),
                      PagoStatusBadge(estado: pago.estado),
                    ],
                  ),
                ],
              ),
            ),
            if (pago.cuentaGenerada) ...[
              const SizedBox(width: 12),
              Icon(
                Icons.picture_as_pdf_outlined,
                color: AppColors.primary,
                size: 24,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
