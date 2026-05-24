import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/theme/app_colors.dart';
import '../../../state/app_state.dart';
import '../../../models/logistico.dart';

enum EstadoJornadaUI { activo, enRuta, pausa, finJornada }

class JornadaScreen extends StatefulWidget {
  const JornadaScreen({super.key});

  @override
  State<JornadaScreen> createState() => _JornadaScreenState();
}

class _JornadaScreenState extends State<JornadaScreen> {
  Map<String, dynamic>? _jornadaActiva;
  Timer? _gpsTimer;
  bool _loading = false;

  @override
  void dispose() {
    _gpsTimer?.cancel();
    super.dispose();
  }

  Future<void> _cargarJornadaActiva() async {
    final app = AppState.of(context);
    try {
      final data = await app.jornadaService.obtenerJornadaActiva();
      if (mounted) setState(() => _jornadaActiva = data);
    } catch (_) {
      if (mounted) setState(() => _jornadaActiva = null);
    }
  }

  Future<void> _iniciarJornada() async {
    setState(() => _loading = true);
    final app = AppState.of(context);
    try {
      final data = await app.jornadaService.iniciarJornada();
      if (mounted) {
        setState(() {
          _jornadaActiva = data;
          _loading = false;
        });
        _iniciarGps(data['id']);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _cambiarEstado(String estado) async {
    if (_jornadaActiva == null) return;
    setState(() => _loading = true);
    final app = AppState.of(context);
    try {
      final data = await app.jornadaService.cambiarEstado(
        _jornadaActiva!['id'],
        estado,
      );
      if (mounted) {
        setState(() {
          _jornadaActiva = data;
          _loading = false;
        });
        if (estado == 'FIN_JORNADA') {
          _gpsTimer?.cancel();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Jornada finalizada'),
              backgroundColor: AppColors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _iniciarGps(int jornadaId) async {
    final permiso = await Geolocator.checkPermission();
    if (permiso == LocationPermission.denied) {
      await Geolocator.requestPermission();
    }
    final verificar = await Geolocator.checkPermission();
    if (verificar == LocationPermission.denied ||
        verificar == LocationPermission.deniedForever) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Se requiere permiso de ubicación para registrar tu posición',
            ),
            backgroundColor: Colors.orange,
          ),
        );
      }
      return;
    }

    Future<void> enviarUbicacion() async {
      try {
        final pos = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );
        if (!mounted) return;
        await AppState.of(context).jornadaService.reportarUbicacion(
          jornadaId,
          pos.latitude,
          pos.longitude,
          precision: pos.accuracy,
        );
      } catch (_) {}
    }

    _gpsTimer?.cancel();
    enviarUbicacion();
    _gpsTimer = Timer.periodic(
      const Duration(seconds: 60),
      (_) => enviarUbicacion(),
    );
  }

  String _estadoLabel(String estado) => switch (estado) {
    'ACTIVO' => 'Activo',
    'EN_RUTA' => 'En Ruta',
    'PAUSA' => 'En Pausa',
    'FIN_JORNADA' => 'Finalizada',
    _ => estado,
  };

  Color _estadoColor(String estado) => switch (estado) {
    'ACTIVO' => AppColors.green,
    'EN_RUTA' => AppColors.gold,
    'PAUSA' => AppColors.grayBrown,
    'FIN_JORNADA' => AppColors.darkBrown,
    _ => AppColors.grayBrown,
  };

  IconData _estadoIcon(String estado) => switch (estado) {
    'ACTIVO' => Icons.play_circle_filled,
    'EN_RUTA' => Icons.local_shipping,
    'PAUSA' => Icons.pause_circle_filled,
    'FIN_JORNADA' => Icons.stop_circle,
    _ => Icons.help_outline,
  };

  @override
  Widget build(BuildContext context) {
    final app = AppState.of(context);
    final logistico = app.logistico;

    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      appBar: AppBar(
        title: Text(
          'Mi Jornada',
          style: GoogleFonts.montserrat(
            fontWeight: FontWeight.w700,
            color: AppColors.white,
          ),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
      ),
      body: _jornadaActiva == null
          ? _buildSinJornada(logistico)
          : _buildJornadaActiva(logistico),
    );
  }

  Widget _buildSinJornada(Logistico? logistico) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.play_circle_outline,
              size: 80,
              color: AppColors.primary.withOpacity(0.3),
            ),
            const SizedBox(height: 24),
            Text(
              'No tienes una jornada activa',
              style: GoogleFonts.montserrat(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.darkBrown,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Inicia tu jornada laboral para comenzar el registro de tu actividad',
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppColors.grayBrown,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: _loading ? null : _iniciarJornada,
                icon: _loading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppColors.white,
                        ),
                      )
                    : const Icon(Icons.play_arrow_rounded, size: 28),
                label: Text(
                  _loading ? 'Iniciando...' : 'Iniciar Jornada',
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJornadaActiva(Logistico? logistico) {
    final j = _jornadaActiva!;
    final estado = j['estado'] as String;
    final color = _estadoColor(estado);
    final ubicacion = j['ultimaUbicacion'] as Map<String, dynamic>?;

    return RefreshIndicator(
      onRefresh: _cargarJornadaActiva,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Estado actual
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: color.withOpacity(0.3), width: 2),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.1),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(_estadoIcon(estado), size: 56, color: color),
                const SizedBox(height: 12),
                Text(
                  _estadoLabel(estado),
                  style: GoogleFonts.montserrat(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: color,
                  ),
                ),
                if (j['nombreEvento'] != null) ...[
                  const SizedBox(height: 8),
                  Text(
                    j['nombreEvento'],
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppColors.grayBrown,
                    ),
                  ),
                ],
                const SizedBox(height: 4),
                Text(
                  'Inicio: ${_formatFecha(j['fechaInicio'])}',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppColors.grayBrown,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Botones de estado
          if (estado != 'FIN_JORNADA') ...[
            Text(
              'Cambiar estado',
              style: GoogleFonts.montserrat(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.darkBrown,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _EstadoButton(
                    icon: Icons.play_circle_filled,
                    label: 'Activo',
                    color: AppColors.green,
                    enabled: estado != 'ACTIVO' && !_loading,
                    onTap: () => _cambiarEstado('ACTIVO'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _EstadoButton(
                    icon: Icons.local_shipping,
                    label: 'En Ruta',
                    color: AppColors.gold,
                    enabled: estado != 'EN_RUTA' && !_loading,
                    onTap: () => _cambiarEstado('EN_RUTA'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _EstadoButton(
                    icon: Icons.pause_circle_filled,
                    label: 'Pausa',
                    color: AppColors.grayBrown,
                    enabled: estado != 'PAUSA' && !_loading,
                    onTap: () => _cambiarEstado('PAUSA'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _EstadoButton(
                    icon: Icons.stop_circle,
                    label: 'Fin Jornada',
                    color: Colors.red,
                    enabled: !_loading,
                    onTap: () => _confirmarFinJornada(),
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 24),

          // Ubicación
          if (ubicacion != null) ...[
            Text(
              'Última ubicación',
              style: GoogleFonts.montserrat(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.darkBrown,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.beige),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.location_on,
                      color: AppColors.primary,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${ubicacion['latitud']?.toStringAsFixed(6) ?? '-'}, ${ubicacion['longitud']?.toStringAsFixed(6) ?? '-'}',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.darkBrown,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Precision: ${ubicacion['precisionGps']?.toStringAsFixed(1) ?? '-'}m  |  ${_formatFecha(ubicacion['timestamp'])}',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppColors.grayBrown,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],

          if (_loading) ...[
            const SizedBox(height: 20),
            const Center(child: CircularProgressIndicator()),
          ],
        ],
      ),
    );
  }

  void _confirmarFinJornada() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          '¿Finalizar jornada?',
          style: GoogleFonts.montserrat(fontWeight: FontWeight.w700),
        ),
        content: Text(
          'Esto marcará el fin de tu jornada laboral y dejará de enviar tu ubicación.',
          style: GoogleFonts.inter(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _cambiarEstado('FIN_JORNADA');
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text(
              'Finalizar',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  String _formatFecha(String? iso) {
    if (iso == null) return '-';
    try {
      final dt = DateTime.parse(iso).toLocal();
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return '-';
    }
  }
}

class _EstadoButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final bool enabled;
  final VoidCallback onTap;

  const _EstadoButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: enabled ? color.withOpacity(0.1) : AppColors.beige,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: enabled ? onTap : null,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
          child: Column(
            children: [
              Icon(
                icon,
                color: enabled ? color : AppColors.grayBrown,
                size: 28,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: enabled ? color : AppColors.grayBrown,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
