import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/corposanpedro_logo.dart';
import '../../../core/widgets/decorative_strip.dart';
import '../../../services/api_client.dart';
import '../../../state/app_state.dart';
import '../../shell/main_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl    = TextEditingController();
  final _docCtrl      = TextEditingController();
  final _otpCtrl      = TextEditingController();

  bool _loading       = false;
  String? _error;

  // Paso 1 completado → mostrar pantalla OTP
  bool _otpSent       = false;
  String _emailMasked = '';
  String _emailUsed   = '';

  bool _obscureDoc    = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _docCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

  // ── Paso 1: solicitar OTP ────────────────────────────────────────────────
  Future<void> _requestOtp() async {
    final email = _emailCtrl.text.trim();
    final doc   = _docCtrl.text.trim();
    if (email.isEmpty || doc.isEmpty) {
      setState(() => _error = 'Por favor ingresa tu correo y número de documento');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final result = await AppState.of(context).authService.appLogin(email, doc);
      if (!mounted) return;
      setState(() {
        _loading    = false;
        _otpSent    = true;
        _emailMasked = result.emailMasked;
        _emailUsed  = email;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = e.isUnauthorized || e.statusCode == 400
            ? 'Correo o número de documento incorrectos'
            : e.message;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = 'No se pudo conectar al servidor. Verifica tu conexión.';
      });
    }
  }

  // ── Paso 2: verificar OTP ────────────────────────────────────────────────
  Future<void> _verifyOtp() async {
    final otp = _otpCtrl.text.trim();
    if (otp.length != 6) {
      setState(() => _error = 'El código debe tener 6 dígitos');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final state     = AppState.of(context);
      final logistico = await state.authService.verifyOtp(_emailUsed, otp);
      state.setLogistico(logistico);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const MainShell()),
      );
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = e.statusCode == 400 || e.isUnauthorized
            ? 'Código inválido o expirado'
            : e.message;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = 'No se pudo verificar el código. Intenta de nuevo.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Stack(
                children: [
                  Positioned(
                    right: -30,
                    top: 80,
                    child: HorseRiderDecoration(),
                  ),
                  SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: _otpSent ? _buildOtpStep() : _buildLoginStep(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const DecorativeStrip(height: 56),
        ],
      ),
    );
  }

  // ── Pantalla paso 1 ──────────────────────────────────────────────────────
  Widget _buildLoginStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 52),
        const Center(child: CorpoSanpedroLogo()),
        const SizedBox(height: 52),
        _buildTextField(
          controller: _emailCtrl,
          hint: 'Correo de contacto',
          icon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 14),
        _buildDocField(),
        const SizedBox(height: 28),
        if (_error != null) _buildError(),
        _buildButton(label: 'Continuar', onTap: _requestOtp),
        const SizedBox(height: 18),
        Center(
          child: GestureDetector(
            onTap: () {},
            child: Text(
              '¿Olvidaste tu contraseña?',
              style: GoogleFonts.inter(
                fontSize: 13,
                color: AppColors.gold,
                fontWeight: FontWeight.w500,
                decoration: TextDecoration.underline,
                decorationColor: AppColors.gold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        Center(
          child: Image.asset(
            'assets/images/festival_bambuco.png',
            width: 160,
            fit: BoxFit.contain,
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  // ── Pantalla paso 2 (OTP) ────────────────────────────────────────────────
  Widget _buildOtpStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 52),
        const Center(child: CorpoSanpedroLogo()),
        const SizedBox(height: 40),
        Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.mark_email_read_outlined,
                color: AppColors.primary, size: 40),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Revisa tu correo',
          textAlign: TextAlign.center,
          style: GoogleFonts.montserrat(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.darkBrown,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Enviamos un código de 6 dígitos a\n$_emailMasked',
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 13,
            color: AppColors.grayBrown,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 36),
        _buildTextField(
          controller: _otpCtrl,
          hint: 'Código de verificación',
          icon: Icons.lock_outline,
          keyboardType: TextInputType.number,
          maxLength: 6,
          textAlign: TextAlign.center,
          fontSize: 22,
          letterSpacing: 8,
        ),
        const SizedBox(height: 28),
        if (_error != null) _buildError(),
        _buildButton(label: 'Verificar', onTap: _verifyOtp),
        const SizedBox(height: 16),
        Center(
          child: GestureDetector(
            onTap: () => setState(() {
              _otpSent = false;
              _otpCtrl.clear();
              _error = null;
            }),
            child: Text(
              '← Volver',
              style: GoogleFonts.inter(
                fontSize: 13,
                color: AppColors.grayBrown,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
        const SizedBox(height: 40),
      ],
    );
  }

  // ── Widgets reutilizables ────────────────────────────────────────────────
  Widget _buildError() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.primary.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.error_outline, color: AppColors.primary, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                _error!,
                style: GoogleFonts.inter(fontSize: 13, color: AppColors.primary),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    int? maxLength,
    TextAlign textAlign = TextAlign.start,
    double fontSize = 15,
    double? letterSpacing,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.beige,
        borderRadius: BorderRadius.circular(14),
      ),
      child: TextField(
        controller: controller,
        keyboardType: keyboardType,
        maxLength: maxLength,
        textAlign: textAlign,
        style: GoogleFonts.inter(
          fontSize: fontSize,
          color: AppColors.darkBrown,
          letterSpacing: letterSpacing,
        ),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.inter(color: AppColors.grayBrown, fontSize: 15),
          prefixIcon: Icon(icon, color: AppColors.grayBrown, size: 20),
          border: InputBorder.none,
          counterText: '',
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        ),
      ),
    );
  }

  Widget _buildDocField() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.beige,
        borderRadius: BorderRadius.circular(14),
      ),
      child: TextField(
        controller: _docCtrl,
        obscureText: _obscureDoc,
        keyboardType: TextInputType.number,
        style: GoogleFonts.inter(fontSize: 15, color: AppColors.darkBrown),
        decoration: InputDecoration(
          hintText: 'Número de documento',
          hintStyle: GoogleFonts.inter(color: AppColors.grayBrown, fontSize: 15),
          prefixIcon: const Icon(Icons.badge_outlined, color: AppColors.grayBrown, size: 20),
          suffixIcon: GestureDetector(
            onTap: () => setState(() => _obscureDoc = !_obscureDoc),
            child: Icon(
              _obscureDoc ? Icons.visibility_outlined : Icons.visibility_off_outlined,
              color: AppColors.grayBrown,
              size: 20,
            ),
          ),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        ),
      ),
    );
  }

  Widget _buildButton({required String label, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: _loading ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        height: 54,
        decoration: BoxDecoration(
          color: _loading ? AppColors.primary.withOpacity(0.75) : AppColors.primary,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withOpacity(0.35),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Center(
          child: _loading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
                  ),
                )
              : Text(
                  label,
                  style: GoogleFonts.montserrat(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.white,
                  ),
                ),
        ),
      ),
    );
  }
}
