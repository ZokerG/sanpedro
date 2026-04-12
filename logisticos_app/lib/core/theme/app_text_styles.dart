import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._();

  // Montserrat Bold — headings
  static TextStyle montserrat({
    double size = 16,
    FontWeight weight = FontWeight.w700,
    Color color = AppColors.darkBrown,
  }) =>
      GoogleFonts.montserrat(fontSize: size, fontWeight: weight, color: color);

  // Inter — body
  static TextStyle inter({
    double size = 14,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.darkBrown,
  }) =>
      GoogleFonts.inter(fontSize: size, fontWeight: weight, color: color);

  // Shortcuts
  static TextStyle get headingLarge =>
      montserrat(size: 22, color: AppColors.white);

  static TextStyle get headingMedium =>
      montserrat(size: 18, color: AppColors.darkBrown);

  static TextStyle get headingSmall =>
      montserrat(size: 14, color: AppColors.darkBrown);

  static TextStyle get bodyMedium =>
      inter(size: 14, color: AppColors.darkBrown);

  static TextStyle get bodySmall =>
      inter(size: 12, color: AppColors.grayBrown);

  static TextStyle get labelGold =>
      inter(size: 11, weight: FontWeight.w600, color: AppColors.gold);

  static TextStyle get amountLarge =>
      montserrat(size: 28, color: AppColors.gold);
}
