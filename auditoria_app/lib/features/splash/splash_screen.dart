import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../state/app_state.dart';
import '../auth/screens/login_screen.dart';
import '../eventos/screens/eventos_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim;
  late final Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    _fade = CurvedAnimation(parent: _anim, curve: Curves.easeIn);
    _anim.forward();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  Future<void> _init() async {
    final state = AppState.of(context);
    await Future.wait<dynamic>([
      Future.delayed(const Duration(seconds: 2)),
      state.authService.restoreSession().then((auditor) {
        if (auditor != null) state.setAuditor(auditor);
      }),
    ]);
    if (!mounted) return;
    final auditor = AppState.of(context).auditor;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) =>
            auditor != null ? const EventosScreen() : const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: FadeTransition(
        opacity: _fade,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                'assets/images/splash.png',
                width: MediaQuery.of(context).size.width * 0.65,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 32),
              const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white54),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
