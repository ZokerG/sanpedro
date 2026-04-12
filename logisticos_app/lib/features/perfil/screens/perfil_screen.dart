import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../models/perfil_logistico.dart';
import '../../../state/app_state.dart';
import '../../auth/screens/login_screen.dart';

class PerfilScreen extends StatefulWidget {
  const PerfilScreen({super.key});

  @override
  State<PerfilScreen> createState() => _PerfilScreenState();
}

class _PerfilScreenState extends State<PerfilScreen> {
  PerfilLogistico? _perfil;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final state = AppState.of(context);
    final logistico = state.logistico;
    if (logistico == null) return;

    setState(() { _loading = true; _error = null; });
    try {
      final perfil = await state.personalService.getPerfil(int.parse(logistico.id));
      if (!mounted) return;
      setState(() { _perfil = perfil; _loading = false; });
    } catch (e) {
      if (!mounted) return;
      setState(() { _loading = false; _error = e.toString(); });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundWarm,
      body: Column(
        children: [
          _buildHeader(context),
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation(AppColors.primary),
                    ),
                  )
                : _error != null
                    ? _buildError()
                    : _buildContent(),
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
        bottom: 20,
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          Text(
            'Mi Perfil',
            style: GoogleFonts.montserrat(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, size: 48, color: AppColors.grayBrown),
            const SizedBox(height: 14),
            Text(_error!,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(fontSize: 14, color: AppColors.grayBrown)),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: _load,
              child: Text(
                'Reintentar',
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent() {
    final p = _perfil!;
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
      children: [
        _buildAvatar(p),
        const SizedBox(height: 24),
        _buildSection(
          title: 'Datos Personales',
          icon: Icons.person_outline,
          items: [
            _InfoItem('Nombre completo', p.nombreCompleto),
            if (p.tipoDocumento != null && p.numeroDocumento != null)
              _InfoItem(p.tipoDocumento!, p.numeroDocumento!),
            if (p.fechaNacimiento != null)
              _InfoItem('Fecha de nacimiento', _formatDate(p.fechaNacimiento!)),
            if (p.email != null) _InfoItem('Correo', p.email!),
            if (p.telefono != null) _InfoItem('Teléfono', p.telefono!),
            if (p.direccion != null) _InfoItem('Dirección', p.direccion!),
          ],
        ),
        const SizedBox(height: 16),
        _buildSection(
          title: 'Información Laboral',
          icon: Icons.work_outline,
          items: [
            if (p.cargoNombre != null) _InfoItem('Cargo', p.cargoNombre!),
            if (p.tipoPersonal != null) _InfoItem('Tipo personal', p.tipoPersonal!),
            if (p.numeroCamiseta != null)
              _InfoItem('Número de camiseta', '#${p.numeroCamiseta}'),
            if (p.arl != null) _InfoItem('ARL', p.arl!),
            _InfoItem(
              'Estado',
              p.activo ? 'Activo' : 'Inactivo',
              valueColor: p.activo ? AppColors.green : AppColors.grayBrown,
            ),
          ],
        ),
        const SizedBox(height: 16),
        _buildSection(
          title: 'Datos Bancarios',
          icon: Icons.account_balance_outlined,
          items: [
            if (p.bancoNombre != null) _InfoItem('Banco', p.bancoNombre!),
            if (p.tipoCuentaBancariaNombre != null)
              _InfoItem('Tipo de cuenta', p.tipoCuentaBancariaNombre!),
            if (p.numeroCuenta != null) _InfoItem('Número de cuenta', p.numeroCuenta!),
          ],
        ),
        const SizedBox(height: 24),
        _buildLogoutButton(),
      ],
    );
  }

  Widget _buildAvatar(PerfilLogistico p) {
    final initials = p.nombreCompleto
        .split(' ')
        .where((w) => w.isNotEmpty)
        .map((w) => w[0])
        .take(2)
        .join()
        .toUpperCase();

    ImageProvider? imageProvider;
    if (p.fotoPerfil != null && p.fotoPerfil!.contains(',')) {
      try {
        final base64Data = p.fotoPerfil!.split(',').last;
        imageProvider = MemoryImage(base64Decode(base64Data));
      } catch (_) {}
    }

    return Column(
      children: [
        Container(
          width: 96,
          height: 96,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.gold, width: 3),
            color: AppColors.darkBrown,
            image: imageProvider != null
                ? DecorationImage(image: imageProvider, fit: BoxFit.cover)
                : null,
          ),
          child: imageProvider == null
              ? Center(
                  child: Text(
                    initials,
                    style: GoogleFonts.montserrat(
                      fontSize: 30,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                  ),
                )
              : null,
        ),
        const SizedBox(height: 12),
        Text(
          p.nombreCompleto,
          style: GoogleFonts.montserrat(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.darkBrown,
          ),
          textAlign: TextAlign.center,
        ),
        if (p.cargoNombre != null) ...[
          const SizedBox(height: 4),
          Text(
            p.cargoNombre!,
            style: GoogleFonts.inter(fontSize: 13, color: AppColors.grayBrown),
          ),
        ],
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
          decoration: BoxDecoration(
            color: p.activo
                ? AppColors.green.withOpacity(0.12)
                : AppColors.grayBrown.withOpacity(0.12),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            p.activo ? 'Activo' : 'Inactivo',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: p.activo ? AppColors.green : AppColors.grayBrown,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<_InfoItem> items,
  }) {
    final visibleItems = items.where((i) => i.value.isNotEmpty).toList();
    if (visibleItems.isEmpty) return const SizedBox.shrink();

    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.darkBrown.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, size: 16, color: AppColors.primary),
                ),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkBrown,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.beige),
          ...visibleItems.asMap().entries.map((entry) {
            final isLast = entry.key == visibleItems.length - 1;
            return _buildInfoRow(entry.value, isLast: isLast);
          }),
        ],
      ),
    );
  }

  Widget _buildInfoRow(_InfoItem item, {bool isLast = false}) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: Text(
                  item.label,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppColors.grayBrown,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 3,
                child: Text(
                  item.value,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: item.valueColor ?? AppColors.darkBrown,
                  ),
                  textAlign: TextAlign.right,
                ),
              ),
            ],
          ),
        ),
        if (!isLast) const Divider(height: 1, indent: 16, color: AppColors.beige),
      ],
    );
  }

  String _formatDate(String iso) {
    try {
      final parts = iso.split('-');
      if (parts.length < 3) return iso;
      final meses = [
        '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
      ];
      return '${parts[2]} de ${meses[int.parse(parts[1])]} de ${parts[0]}';
    } catch (_) {
      return iso;
    }
  }

  Widget _buildLogoutButton() {
    return GestureDetector(
      onTap: () async {
        final state = AppState.of(context);
        await state.authService.logout();
        state.clearSession();
        if (!mounted) return;
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (_) => false,
        );
      },
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.primary.withOpacity(0.25)),
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.logout, color: AppColors.primary, size: 20),
              const SizedBox(width: 10),
              Text(
                'Cerrar sesión',
                style: GoogleFonts.montserrat(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoItem {
  final String label;
  final String value;
  final Color? valueColor;
  const _InfoItem(this.label, this.value, {this.valueColor});
}
