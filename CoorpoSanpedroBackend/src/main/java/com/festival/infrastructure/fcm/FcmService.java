package com.festival.infrastructure.fcm;

import com.festival.entity.DeviceToken;
import com.festival.infrastructure.persistence.repository.DeviceTokenRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FcmService {

    private static final Logger log = LoggerFactory.getLogger(FcmService.class);
    private final DeviceTokenRepository deviceTokenRepository;

    public void enviarAUsuario(Long usuarioId, String titulo, String cuerpo, Map<String, String> data) {
        List<DeviceToken> tokens = deviceTokenRepository.findByUsuarioIdAndActivoTrue(usuarioId);
        for (DeviceToken dt : tokens) {
            enviarAToken(dt.getTokenFcm(), titulo, cuerpo, data);
        }
    }

    public void enviarATodos(String titulo, String cuerpo, Map<String, String> data) {
        List<DeviceToken> tokens = deviceTokenRepository.findByActivoTrue();
        for (DeviceToken dt : tokens) {
            enviarAToken(dt.getTokenFcm(), titulo, cuerpo, data);
        }
    }

    public void enviarATokens(List<String> tokens, String titulo, String cuerpo, Map<String, String> data) {
        for (String token : tokens) {
            enviarAToken(token, titulo, cuerpo, data);
        }
    }

    private void enviarAToken(String fcmToken, String titulo, String cuerpo, Map<String, String> data) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(titulo)
                    .setBody(cuerpo)
                    .build();

            Message.Builder builder = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(notification);

            if (data != null && !data.isEmpty()) {
                builder.putAllData(data);
            }

            Message message = builder.build();
            String response = FirebaseMessaging.getInstance().send(message);
            log.debug("FCM enviado a token {}: {}", fcmToken.substring(0, 10) + "...", response);
        } catch (FirebaseMessagingException e) {
            log.error("Error enviando FCM a token {}: {}", fcmToken.substring(0, 10) + "...", e.getMessage());

            if (e.getMessagingErrorCode() == MessagingErrorCode.UNREGISTERED || "registration-token-not-registered".equals(e.getErrorCode())) {
                deviceTokenRepository.findByUsuarioIdAndActivoTrue(0L).stream()
                        .filter(dt -> dt.getTokenFcm().equals(fcmToken))
                        .findFirst()
                        .ifPresent(dt -> {
                            dt.setActivo(false);
                            deviceTokenRepository.save(dt);
                            log.info("Token FCM marcado como inactivo: {}", fcmToken.substring(0, 10) + "...");
                        });
            }
        }
    }

    public void registrarToken(Long usuarioId, String fcmToken, String plataforma) {
        if (!deviceTokenRepository.existsByTokenFcm(fcmToken)) {
            DeviceToken dt = new DeviceToken();
            dt.setUsuarioId(usuarioId);
            dt.setTokenFcm(fcmToken);
            dt.setPlataforma(plataforma);
            dt.setActivo(true);
            deviceTokenRepository.save(dt);
            log.info("Token FCM registrado: usuario={}, plataforma={}", usuarioId, plataforma);
        }
    }
}
