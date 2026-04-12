import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/splash_screen.dart';
import 'state/app_state.dart';

void main() {
  runApp(const LogisticosApp());
}

class LogisticosApp extends StatefulWidget {
  const LogisticosApp({super.key});

  @override
  State<LogisticosApp> createState() => _LogisticosAppState();
}

class _LogisticosAppState extends State<LogisticosApp> {
  final _controller = AppStateController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppState(
      controller: _controller,
      child: MaterialApp(
        title: 'CorpoSanpedro Logísticos',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const SplashScreen(),
      ),
    );
  }
}
