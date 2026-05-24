import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

class NotificationService {
  final void Function(String token, String plataforma) onTokenReceived;

  NotificationService({required this.onTokenReceived});

  Future<void> init() async {
    try {
      final messaging = FirebaseMessaging.instance;

      final settings = await messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      debugPrint('FCM permission: ${settings.authorizationStatus}');

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        final token = await messaging.getToken();
        debugPrint('FCM token obtained: ${token?.substring(0, 20)}...');
        if (token != null) {
          final plataforma = defaultTargetPlatform == TargetPlatform.iOS
              ? 'IOS'
              : 'ANDROID';
          onTokenReceived(token, plataforma);
        }
      } else {
        debugPrint('FCM permission denied: ${settings.authorizationStatus}');
      }
    } catch (e) {
      debugPrint('FCM init error: $e');
    }

    FirebaseMessaging.onMessage.listen(_handleForeground);
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);
  }

  void _handleForeground(RemoteMessage message) {}

  void _handleNotificationTap(RemoteMessage message) {}
}
