package com.festival.application.usecase.auth;

import com.festival.application.dto.auth.AppLoginInitResponseDTO;
import com.festival.application.dto.auth.AppLoginRequestDTO;
import com.festival.application.dto.auth.AppLoginResponseDTO;
import com.festival.application.dto.auth.AppOtpRequestDTO;

public interface AppAuthUseCase {
    AppLoginInitResponseDTO initLogin(AppLoginRequestDTO request);
    AppLoginResponseDTO verifyOtp(AppOtpRequestDTO request);
}
