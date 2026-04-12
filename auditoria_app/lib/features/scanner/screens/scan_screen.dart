import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../../core/theme/app_colors.dart';
import '../../../services/asistencia_service.dart';
import '../../../state/app_state.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> with WidgetsBindingObserver {
  final MobileScannerController _scanner = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
    facing: CameraFacing.back,
  );

  bool _processing = false;
  ResultadoScan? _ultimo;
  Timer? _resetTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _resetTimer?.cancel();
    _scanner.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      _scanner.stop();
    } else if (state == AppLifecycleState.resumed) {
      _scanner.start();
    }
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_processing) return;
    final qr = capture.barcodes.firstOrNull?.rawValue;
    if (qr == null || qr.isEmpty) return;

    final estado = AppState.of(context);
    final evento = estado.eventoSeleccionado;
    if (evento == null) return;

    setState(() => _processing = true);
    await _scanner.stop();

    try {
      final resultado = await estado.asistenciaService.escanear(
        codigoQr: qr,
        eventoId: evento.id,
        registradoPor: estado.auditor?.nombre,
      );

      if (!mounted) return;
      setState(() => _ultimo = resultado);

      _resetTimer?.cancel();
      _resetTimer = Timer(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _ultimo = null;
            _processing = false;
          });
          _scanner.start();
        }
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _ultimo = ResultadoScan(
          resultado: ResultadoEscaneo.rechazado,
          mensaje: e.toString(),
        );
        _processing = false;
      });
      _resetTimer?.cancel();
      _resetTimer = Timer(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() => _ultimo = null);
          _scanner.start();
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // ── Cámara ──────────────────────────────────────────────────────────
        MobileScanner(
          controller: _scanner,
          onDetect: _onDetect,
        ),

        // ── Marco de enfoque ────────────────────────────────────────────────
        _ScanFrame(),

        // ── Overlay de resultado ─────────────────────────────────────────────
        if (_ultimo != null)
          _ResultOverlay(resultado: _ultimo!),
      ],
    );
  }
}

// ── Marco visual del área de escaneo ────────────────────────────────────────
class _ScanFrame extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final w = constraints.maxWidth;
      final h = constraints.maxHeight;
      final frameSize = w * 0.7;
      final left = (w - frameSize) / 2;
      final top = (h - frameSize) / 2 - 40;

      return Stack(
        children: [
          // Overlay oscuro con recorte
          CustomPaint(
            size: Size(w, h),
            painter: _FramePainter(
              frameRect: Rect.fromLTWH(left, top, frameSize, frameSize),
            ),
          ),
          // Esquinas de color rojo
          Positioned(
            top: top - 2,
            left: left - 2,
            child: _Corner(tl: true),
          ),
          Positioned(
            top: top - 2,
            left: left + frameSize - 22,
            child: _Corner(tr: true),
          ),
          Positioned(
            top: top + frameSize - 22,
            left: left - 2,
            child: _Corner(bl: true),
          ),
          Positioned(
            top: top + frameSize - 22,
            left: left + frameSize - 22,
            child: _Corner(br: true),
          ),
          // Instrucción
          Positioned(
            bottom: h * 0.18,
            left: 0,
            right: 0,
            child: Text(
              'Apunta la cámara al código QR del logístico',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 13,
                color: AppColors.white.withOpacity(0.85),
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      );
    });
  }
}

class _FramePainter extends CustomPainter {
  final Rect frameRect;
  const _FramePainter({required this.frameRect});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.black54;
    final full = Rect.fromLTWH(0, 0, size.width, size.height);
    final path = Path()
      ..addRect(full)
      ..addRRect(RRect.fromRectAndRadius(frameRect, const Radius.circular(14)))
      ..fillType = PathFillType.evenOdd;
    canvas.drawPath(path, paint);

    final borderPaint = Paint()
      ..color = Colors.white.withOpacity(0.6)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    canvas.drawRRect(
        RRect.fromRectAndRadius(frameRect, const Radius.circular(14)),
        borderPaint);
  }

  @override
  bool shouldRepaint(_FramePainter o) => o.frameRect != frameRect;
}

class _Corner extends StatelessWidget {
  final bool tl, tr, bl, br;
  const _Corner({this.tl = false, this.tr = false, this.bl = false, this.br = false});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(24, 24),
      painter: _CornerPainter(tl: tl, tr: tr, bl: bl, br: br),
    );
  }
}

class _CornerPainter extends CustomPainter {
  final bool tl, tr, bl, br;
  const _CornerPainter({this.tl = false, this.tr = false, this.bl = false, this.br = false});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square;
    final l = size.width;
    if (tl) {
      canvas.drawLine(const Offset(0, 20), const Offset(0, 0), paint);
      canvas.drawLine(const Offset(0, 0), const Offset(20, 0), paint);
    }
    if (tr) {
      canvas.drawLine(Offset(l, 20), Offset(l, 0), paint);
      canvas.drawLine(Offset(l, 0), Offset(l - 20, 0), paint);
    }
    if (bl) {
      canvas.drawLine(Offset(0, l - 20), Offset(0, l), paint);
      canvas.drawLine(Offset(0, l), Offset(20, l), paint);
    }
    if (br) {
      canvas.drawLine(Offset(l, l - 20), Offset(l, l), paint);
      canvas.drawLine(Offset(l, l), Offset(l - 20, l), paint);
    }
  }

  @override
  bool shouldRepaint(_CornerPainter o) => false;
}

// ── Overlay de resultado (verde/naranja/rojo) ───────────────────────────────
class _ResultOverlay extends StatefulWidget {
  final ResultadoScan resultado;
  const _ResultOverlay({required this.resultado});

  @override
  State<_ResultOverlay> createState() => _ResultOverlayState();
}

class _ResultOverlayState extends State<_ResultOverlay>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 350));
    _scale = CurvedAnimation(parent: _anim, curve: Curves.elasticOut);
    _anim.forward();
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  Color get _bgColor {
    switch (widget.resultado.resultado) {
      case ResultadoEscaneo.ingreso:
        return AppColors.scanIngreso;
      case ResultadoEscaneo.salida:
        return AppColors.scanSalida;
      case ResultadoEscaneo.rechazado:
        return AppColors.scanRechazado;
    }
  }

  IconData get _icon {
    switch (widget.resultado.resultado) {
      case ResultadoEscaneo.ingreso:
        return Icons.check_circle_outline;
      case ResultadoEscaneo.salida:
        return Icons.logout;
      case ResultadoEscaneo.rechazado:
        return Icons.cancel_outlined;
    }
  }

  String get _titulo {
    switch (widget.resultado.resultado) {
      case ResultadoEscaneo.ingreso:
        return 'INGRESO';
      case ResultadoEscaneo.salida:
        return 'SALIDA';
      case ResultadoEscaneo.rechazado:
        return 'RECHAZADO';
    }
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.resultado;

    return Container(
      color: Colors.black.withOpacity(0.65),
      child: Center(
        child: ScaleTransition(
          scale: _scale,
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 40),
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: _bgColor.withOpacity(0.3),
                  blurRadius: 30,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _bgColor.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(_icon, color: _bgColor, size: 44),
                ),
                const SizedBox(height: 16),
                Text(
                  _titulo,
                  style: GoogleFonts.montserrat(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: _bgColor,
                    letterSpacing: 1,
                  ),
                ),
                if (r.nombrePersonal != null) ...[
                  const SizedBox(height: 10),
                  Text(
                    r.nombrePersonal!,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.montserrat(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.darkBrown,
                    ),
                  ),
                  if (r.numeroCamiseta != null) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'Camiseta #${r.numeroCamiseta}',
                        style: GoogleFonts.montserrat(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ],
                const SizedBox(height: 10),
                Text(
                  r.mensaje,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppColors.grayBrown,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
