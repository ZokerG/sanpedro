import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/event_card.dart';
import '../../../models/evento.dart';
import '../../../state/app_state.dart';
import 'event_detail_screen.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  EstadoEvento? _filtroActivo;
  List<Evento> _todos = [];
  bool _loading = true;
  String? _error;

  List<Evento> get _eventosFiltrados {
    if (_filtroActivo == null) return _todos;
    return _todos.where((e) => e.estado == _filtroActivo).toList();
  }

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
      final eventos = await state.eventoService
          .getEventosDePersonal(int.parse(logistico.id));
      if (!mounted) return;
      setState(() { _todos = eventos; _loading = false; });
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
          _buildFiltros(),
          Expanded(
            child: _loading
                ? const Center(
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation(AppColors.primary),
                    ),
                  )
                : RefreshIndicator(
                    color: AppColors.primary,
                    onRefresh: _load,
                    child: _error != null
                        ? _buildScrollableError()
                        : _eventosFiltrados.isEmpty
                            ? _buildScrollableEmpty()
                            : ListView.builder(
                                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                                itemCount: _eventosFiltrados.length,
                                itemBuilder: (context, i) {
                                  final evento = _eventosFiltrados[i];
                                  return EventCard(
                                    evento: evento,
                                    onTap: () => Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (_) => EventDetailScreen(evento: evento),
                                      ),
                                    ),
                                  );
                                },
                              ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: AppColors.primary,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        left: 20,
        right: 20,
        bottom: 20,
      ),
      child: Row(
        children: [
          Text(
            'Mis eventos',
            style: GoogleFonts.montserrat(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.white,
            ),
          ),
          const Spacer(),
          const Icon(Icons.calendar_month, color: AppColors.white, size: 24),
        ],
      ),
    );
  }

  Widget _buildFiltros() {
    final filtros = <String, EstadoEvento?>{
      'Todos': null,
      'Próximos': EstadoEvento.proximo,
      'En curso': EstadoEvento.enCurso,
      'Liquidación': EstadoEvento.liquidacion,
      'Finalizados': EstadoEvento.finalizado,
    };

    return Container(
      color: AppColors.white,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: filtros.entries.map((entry) {
            final isActive = _filtroActivo == entry.value;
            return GestureDetector(
              onTap: () => setState(() => _filtroActivo = entry.value),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: isActive ? AppColors.primary : AppColors.beige,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  entry.key,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                    color: isActive ? AppColors.white : AppColors.darkBrown,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  // Envueltos en ListView para que el RefreshIndicator funcione en estado vacío/error
  Widget _buildScrollableEmpty() {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(
          height: MediaQuery.of(context).size.height * 0.5,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.calendar_month_outlined,
                  size: 56, color: AppColors.grayBrown.withOpacity(0.5)),
              const SizedBox(height: 14),
              Text('No hay eventos en esta categoría',
                  style: GoogleFonts.inter(
                      fontSize: 14, color: AppColors.grayBrown)),
              const SizedBox(height: 8),
              Text('Desliza hacia abajo para recargar',
                  style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppColors.grayBrown.withOpacity(0.6))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildScrollableError() {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(
          height: MediaQuery.of(context).size.height * 0.5,
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.wifi_off, size: 48, color: AppColors.grayBrown),
                const SizedBox(height: 14),
                Text(_error!,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                        fontSize: 14, color: AppColors.grayBrown)),
                const SizedBox(height: 8),
                Text('Desliza hacia abajo para reintentar',
                    style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppColors.grayBrown.withOpacity(0.6))),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
