package com.festival.application.service.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Value("${otp.expiration-minutes:5}")
    private int expirationMinutes;

    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, OtpEntry> store = new ConcurrentHashMap<>();

    public String generate(String email) {
        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiry = Instant.now().plusSeconds(expirationMinutes * 60L);
        store.put(email.toLowerCase(), new OtpEntry(code, expiry));
        return code;
    }

    public boolean verify(String email, String code) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiry())) {
            store.remove(email.toLowerCase());
            return false;
        }
        boolean valid = entry.code().equals(code);
        if (valid) store.remove(email.toLowerCase());
        return valid;
    }

    private record OtpEntry(String code, Instant expiry) {}
}
