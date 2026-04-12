import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../home/screens/home_screen.dart';
import '../qr/screens/qr_screen.dart';
import '../events/screens/events_screen.dart';
import '../payments/screens/payments_screen.dart';
import '../solicitudes/screens/solicitudes_screen.dart';

class MainShell extends StatefulWidget {
  final int initialIndex;

  const MainShell({super.key, this.initialIndex = 0});

  static MainShellState? of(BuildContext context) {
    return context.findAncestorStateOfType<MainShellState>();
  }

  @override
  State<MainShell> createState() => MainShellState();
}

class MainShellState extends State<MainShell> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void navigateTo(int index) {
    setState(() => _currentIndex = index);
  }

  final List<Widget> _screens = const [
    HomeScreen(),
    QrScreen(),
    EventsScreen(),
    PaymentsScreen(),
    SolicitudesScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: _BottomNavBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
      ),
    );
  }
}

class _BottomNavBar extends StatefulWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const _BottomNavBar({required this.currentIndex, required this.onTap});

  @override
  State<_BottomNavBar> createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<_BottomNavBar>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseCtrl;
  late final Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 1.0, end: 1.10).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bottomPad = MediaQuery.of(context).padding.bottom;
    final isQrActive = widget.currentIndex == 1;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(top: BorderSide(color: AppColors.beige, width: 1.5)),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60 + bottomPad,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              // 2 ítems izquierda | espacio QR | 2 ítems derecha
              Positioned.fill(
                child: Row(
                  children: [
                    Expanded(
                      child: _NavItem(
                        icon: Icons.home_outlined,
                        iconActive: Icons.home_rounded,
                        label: 'Inicio',
                        isActive: widget.currentIndex == 0,
                        onTap: () => widget.onTap(0),
                      ),
                    ),
                    Expanded(
                      child: _NavItem(
                        icon: Icons.calendar_month_outlined,
                        iconActive: Icons.calendar_month,
                        label: 'Mis eventos',
                        isActive: widget.currentIndex == 2,
                        onTap: () => widget.onTap(2),
                      ),
                    ),
                    // Espacio central para el botón QR
                    const SizedBox(width: 72),
                    Expanded(
                      child: _NavItem(
                        icon: Icons.account_balance_wallet_outlined,
                        iconActive: Icons.account_balance_wallet,
                        label: 'Mis pagos',
                        isActive: widget.currentIndex == 3,
                        onTap: () => widget.onTap(3),
                      ),
                    ),
                    Expanded(
                      child: _NavItem(
                        icon: Icons.assignment_outlined,
                        iconActive: Icons.assignment,
                        label: 'Solicitudes',
                        isActive: widget.currentIndex == 4,
                        onTap: () => widget.onTap(4),
                      ),
                    ),
                  ],
                ),
              ),
              // Botón QR flotante centrado
              Positioned(
                top: -22,
                left: 0,
                right: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () => widget.onTap(1),
                    child: ScaleTransition(
                      scale: isQrActive
                          ? AlwaysStoppedAnimation(1.0)
                          : _pulseAnim,
                      child: Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isQrActive ? AppColors.darkBrown : AppColors.primary,
                          boxShadow: [
                            BoxShadow(
                              color: (isQrActive
                                      ? AppColors.darkBrown
                                      : AppColors.primary)
                                  .withOpacity(0.45),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              isQrActive ? Icons.qr_code : Icons.qr_code_2,
                              color: AppColors.white,
                              size: 26,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Mi QR',
                              style: GoogleFonts.montserrat(
                                fontSize: 8,
                                fontWeight: FontWeight.w700,
                                color: AppColors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData iconActive;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.iconActive,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = isActive ? AppColors.primary : AppColors.grayBrown;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isActive ? iconActive : icon,
                key: ValueKey(isActive),
                color: color,
                size: 24,
              ),
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
