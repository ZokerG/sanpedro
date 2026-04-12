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
  final _usuarioCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscurePassword = true;
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _usuarioCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final correo = _usuarioCtrl.text.trim();
    final contrasena = _passwordCtrl.text;

    if (correo.isEmpty || contrasena.isEmpty) {
      setState(() => _error = 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setState(() { _loading = true; _error = null; });

    try {
      final state = AppState.of(context);
      final result = await state.authService.login(correo, contrasena);

      // Buscar personal logístico con ese correo.
      // Si no existe (no es logístico), getByEmail lanza 404.
      final logistico = await state.personalService.getByEmail(result.correo);
      state.setLogistico(logistico);

      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const MainShell()),
      );
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = e.isUnauthorized
            ? 'Correo o contraseña incorrectos'
            : e.isNotFound
                ? 'Esta app es exclusiva para personal logístico'
                : e.message;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = 'No se pudo conectar al servidor. Verifica tu conexión.';
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
                  // Ilustración decorativa caballo/jinete
                  Positioned(
                    right: -20,
                    top: 120,
                    child: Opacity(
                      opacity: 1,
                      child: HorseRiderDecoration(),
                    ),
                  ),
                  // Contenido principal
                  SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const SizedBox(height: 52),
                          // Logo
                          const Center(child: CorpoSanpedroLogo()),
                          const SizedBox(height: 52),
                          // Campos
                          _buildTextField(
                            controller: _usuarioCtrl,
                            hint: 'Usuario',
                            icon: Icons.person_outline,
                          ),
                          const SizedBox(height: 14),
                          _buildPasswordField(),
                          const SizedBox(height: 28),
                          // Error
                          if (_error != null) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 12),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                    color: AppColors.primary.withOpacity(0.3)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.error_outline,
                                      color: AppColors.primary, size: 18),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _error!,
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        color: AppColors.primary,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 14),
                          ],
                          // Botón
                          _buildLoginButton(),
                          const SizedBox(height: 18),
                          // Olvidaste contraseña
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
                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Franja decorativa inferior
          const DecorativeStrip(height: 56),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.beige,
        borderRadius: BorderRadius.circular(14),
      ),
      child: TextField(
        controller: controller,
        style: GoogleFonts.inter(
          fontSize: 15,
          color: AppColors.darkBrown,
        ),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.inter(
            color: AppColors.grayBrown,
            fontSize: 15,
          ),
          prefixIcon: Icon(icon, color: AppColors.grayBrown, size: 20),
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        ),
      ),
    );
  }

  Widget _buildPasswordField() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.beige,
        borderRadius: BorderRadius.circular(14),
      ),
      child: TextField(
        controller: _passwordCtrl,
        obscureText: _obscurePassword,
        style: GoogleFonts.inter(
          fontSize: 15,
          color: AppColors.darkBrown,
        ),
        decoration: InputDecoration(
          hintText: 'Contraseña',
          hintStyle: GoogleFonts.inter(
            color: AppColors.grayBrown,
            fontSize: 15,
          ),
          prefixIcon: const Icon(
            Icons.lock_outline,
            color: AppColors.grayBrown,
            size: 20,
          ),
          suffixIcon: GestureDetector(
            onTap: () => setState(() => _obscurePassword = !_obscurePassword),
            child: Icon(
              _obscurePassword
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

  Widget _buildLoginButton() {
    return GestureDetector(
      onTap: _loading ? null : _login,
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
                  'Iniciar sesión',
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
