import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../services/api_client.dart';
import '../../../services/auth_service.dart';
import '../../../state/app_state.dart';
import '../../eventos/screens/eventos_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _docCtrl   = TextEditingController();
  final _otpCtrl   = TextEditingController();

  bool    _loading     = false;
  String? _error;
  bool    _otpSent     = false;
  String  _emailMasked = '';
  String  _emailUsed   = '';
  bool    _obscureDoc  = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _docCtrl.dispose();
    _otpCtrl.dispose();
    super.dispose();
  }

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
        _loading      = false;
        _otpSent      = true;
        _emailMasked  = result.emailMasked;
        _emailUsed    = email;
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

  Future<void> _verifyOtp() async {
    final otp = _otpCtrl.text.trim();
    if (otp.length != 6) {
      setState(() => _error = 'El código debe tener 6 dígitos');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final state   = AppState.of(context);
      final auditor = await state.authService.verifyOtp(_emailUsed, otp);
      state.setAuditor(auditor);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const EventosScreen()),
      );
    } on RolNoPermitidoException catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.message; });
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
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: _otpSent ? _buildOtpStep() : _buildLoginStep(),
        ),
      ),
    );
  }

  Widget _buildLoginStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 52),
        _buildLogo(),
        const SizedBox(height: 12),
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.darkBrown.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'APP AUDITORES',
              style: GoogleFonts.montserrat(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.darkBrown,
                letterSpacing: 1.8,
              ),
            ),
          ),
        ),
        const SizedBox(height: 48),
        _buildTextField(
          controller: _emailCtrl,
          hint: 'Correo de contacto',
          icon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 14),
        _buildDocField(),
        const SizedBox(height: 28),
        if (_error != null) _buildErrorBox(),
        _buildButton(label: 'Continuar', onTap: _requestOtp),
        const SizedBox(height: 40),
      ],
    );
  }

  Widget _buildOtpStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 52),
        _buildLogo(),
        const SizedBox(height: 40),
        Center(
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.mark_email_read_outlined,
                color: AppColors.primary, size: 42),
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
          'Código de 6 dígitos enviado a\n$_emailMasked',
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
        if (_error != null) _buildErrorBox(),
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

  Widget _buildLogo() {
    return Center(
      child: Image.asset(
        'assets/images/logo_corposanpedro.png',
        height: 72,
        fit: BoxFit.contain,
      ),
    );
  }

  Widget _buildErrorBox() {
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
                style:
                    GoogleFonts.inter(fontSize: 13, color: AppColors.primary),
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
          hintStyle:
              GoogleFonts.inter(color: AppColors.grayBrown, fontSize: 15),
          prefixIcon: Icon(icon, color: AppColors.grayBrown, size: 20),
          border: InputBorder.none,
          counterText: '',
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
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
          hintStyle:
              GoogleFonts.inter(color: AppColors.grayBrown, fontSize: 15),
          prefixIcon: const Icon(Icons.badge_outlined,
              color: AppColors.grayBrown, size: 20),
          suffixIcon: GestureDetector(
            onTap: () => setState(() => _obscureDoc = !_obscureDoc),
            child: Icon(
              _obscureDoc
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              color: AppColors.grayBrown,
              size: 20,
            ),
          ),
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
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
          color: _loading
              ? AppColors.primary.withOpacity(0.75)
              : AppColors.primary,
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
                    valueColor:
                        AlwaysStoppedAnimation<Color>(AppColors.white),
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
