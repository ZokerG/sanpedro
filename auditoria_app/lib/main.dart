import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'core/theme/app_colors.dart';
import 'state/app_state.dart';
import 'features/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('es', null);
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const AuditoriaApp());
}

class AuditoriaApp extends StatelessWidget {
  const AuditoriaApp({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AppStateController();

    return AppState(
      controller: controller,
      child: MaterialApp(
        title: 'CorpoSanpedro Auditoría',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
          fontFamily: 'Inter',
          scaffoldBackgroundColor: AppColors.backgroundWarm,
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
