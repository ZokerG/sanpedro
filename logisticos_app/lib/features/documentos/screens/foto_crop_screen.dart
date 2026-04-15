import 'dart:typed_data';
import 'package:crop_your_image/crop_your_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';

/// Pantalla de recorte antes de subir la foto de perfil.
/// Retorna [Uint8List] con los bytes recortados, o null si el usuario cancela.
class FotoCropScreen extends StatefulWidget {
  final Uint8List imageBytes;

  const FotoCropScreen({super.key, required this.imageBytes});

  @override
  State<FotoCropScreen> createState() => _FotoCropScreenState();
}

class _FotoCropScreenState extends State<FotoCropScreen> {
  final _controller = CropController();
  bool _cropping = false;

  void _confirmar() {
    setState(() => _cropping = true);
    _controller.crop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          // Header
          Container(
            color: Colors.black,
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 12,
              left: 8,
              right: 16,
              bottom: 16,
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white),
                  onPressed: () => Navigator.of(context).pop(null),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Ajustar foto',
                        style: GoogleFonts.montserrat(
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Centra tu cara dentro del recuadro',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: Colors.white60,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Área de recorte
          Expanded(
            child: Crop(
              controller: _controller,
              image: widget.imageBytes,
              aspectRatio: 1.0, // cuadrado — ideal para foto carnet
              withCircleUi: true,
              baseColor: Colors.black,
              maskColor: Colors.black.withOpacity(0.6),
              cornerDotBuilder: (size, edgeAlignment) => const DotControl(
                color: AppColors.primary,
              ),
              onCropped: (result) {
                if (!mounted) return;
                switch (result) {
                  case CropSuccess(:final croppedImage):
                    Navigator.of(context).pop(Uint8List.fromList(croppedImage));
                  case CropFailure():
                    setState(() => _cropping = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Error al recortar la imagen',
                            style: GoogleFonts.inter(fontSize: 13)),
                        backgroundColor: AppColors.primary,
                      ),
                    );
                }
              },
            ),
          ),

          // Footer con botón confirmar
          Container(
            color: Colors.black,
            padding: EdgeInsets.only(
              left: 24,
              right: 24,
              top: 16,
              bottom: MediaQuery.of(context).padding.bottom + 20,
            ),
            child: Row(
              children: [
                // Previsualización circular
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.primary, width: 2),
                    color: Colors.grey[900],
                  ),
                  child: ClipOval(
                    child: Image.memory(
                      widget.imageBytes,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    'Así se verá en tu carné y perfil',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white60,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Botón confirmar
                GestureDetector(
                  onTap: _cropping ? null : _confirmar,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: _cropping ? Colors.grey[800] : AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: _cropping
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation(Colors.white),
                            ),
                          )
                        : Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.check, color: Colors.white, size: 18),
                              const SizedBox(width: 6),
                              Text(
                                'Usar foto',
                                style: GoogleFonts.montserrat(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
