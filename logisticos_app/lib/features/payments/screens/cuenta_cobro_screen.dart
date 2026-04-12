import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/corposanpedro_logo.dart';
import '../../../models/evento.dart';
import '../../../state/app_state.dart';

class CuentaCobroScreen extends StatelessWidget {
  final Evento evento;

  const CuentaCobroScreen({super.key, required this.evento});

  String get _fechaCompleta {
    final meses = [
      '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return '${evento.fecha.day} de ${meses[evento.fecha.month]} de ${evento.fecha.year}';
  }

  String get _jornadaTrabajada {
    if (evento.horaIngresoRegistrado != null &&
        evento.horaSalidaRegistrada != null) {
      return '${evento.horaIngresoRegistrado} — ${evento.horaSalidaRegistrada}';
    }
    return 'Jornada completa del evento';
  }

  String _formatMoney(double amount) {
    return '\$${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
  }

  @override
  Widget build(BuildContext context) {
    final logistico = AppState.of(context).logistico;
    if (logistico == null) return const SizedBox.shrink();

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
                  // Vista previa documento
                  _DocumentPreview(
                    logistico: logistico,
                    evento: evento,
                    fechaCompleta: _fechaCompleta,
                    jornadaTrabajada: _jornadaTrabajada,
                    formatMoney: _formatMoney,
                  ),
                  const SizedBox(height: 24),
                  // Botón descargar PDF
                  _BotonDescargar(),
                  const SizedBox(height: 16),
                  Text(
                    'Una vez descargado, presenta este documento para hacer efectivo tu pago.',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: AppColors.darkBrown.withOpacity(0.6),
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
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
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new,
                color: AppColors.white, size: 20),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Text(
            'Cuenta de cobro',
            style: GoogleFonts.montserrat(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class _DocumentPreview extends StatelessWidget {
  final dynamic logistico;
  final Evento evento;
  final String fechaCompleta;
  final String jornadaTrabajada;
  final String Function(double) formatMoney;

  const _DocumentPreview({
    required this.logistico,
    required this.evento,
    required this.fechaCompleta,
    required this.jornadaTrabajada,
    required this.formatMoney,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.10),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Encabezado del documento
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 28, 24, 0),
            child: Column(
              children: [
                const CorpoSanpedroLogo(darkMode: false, scale: 0.85),
                const SizedBox(height: 20),
                // Línea dorada
                Container(height: 2, color: AppColors.gold),
                const SizedBox(height: 16),
                Text(
                  'CUENTA DE COBRO',
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: AppColors.darkBrown,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
          // Campos del documento
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 0),
            child: Column(
              children: [
                _DocField(
                  label: 'Nombre completo',
                  value: logistico.nombre,
                ),
                _DocField(
                  label: 'Documento de identidad',
                  value: logistico.documento,
                ),
                _DocField(
                  label: 'Nombre del evento',
                  value: evento.nombre,
                ),
                _DocField(
                  label: 'Fecha del evento',
                  value: fechaCompleta,
                ),
                _DocField(
                  label: 'Jornada trabajada',
                  value: jornadaTrabajada,
                ),
                _DocField(
                  label: 'Tarifa pactada',
                  value: formatMoney(evento.tarifa),
                ),
                const SizedBox(height: 8),
                // Valor a cobrar destacado
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                      vertical: 16, horizontal: 14),
                  decoration: BoxDecoration(
                    color: AppColors.green.withOpacity(0.07),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: AppColors.green.withOpacity(0.2), width: 1),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'VALOR A COBRAR',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.green,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        formatMoney(evento.tarifa),
                        style: GoogleFonts.montserrat(
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          color: AppColors.green,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
          // Línea dorada inferior + footer
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
            child: Column(
              children: [
                Container(height: 2, color: AppColors.gold),
                const SizedBox(height: 12),
                Text(
                  'Generado por CorpoSanpedro · Festival San Pedro del Huila',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: AppColors.grayBrown,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DocField extends StatelessWidget {
  final String label;
  final String value;

  const _DocField({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
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
          const SizedBox(height: 3),
          Text(
            value,
            style: GoogleFonts.montserrat(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.darkBrown,
            ),
          ),
          const SizedBox(height: 8),
          Container(height: 0.8, color: AppColors.beige),
        ],
      ),
    );
  }
}

class _BotonDescargar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'PDF generado exitosamente',
              style: GoogleFonts.inter(color: AppColors.white),
            ),
            backgroundColor: AppColors.green,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      },
      child: Container(
        height: 54,
        decoration: BoxDecoration(
          color: AppColors.primary,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.32),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.download_outlined,
                  color: AppColors.white, size: 22),
              const SizedBox(width: 10),
              Text(
                'Descargar PDF',
                style: GoogleFonts.montserrat(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
