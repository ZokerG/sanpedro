package com.festival.application.usecase.auth;

import com.festival.application.dto.auth.AuthRequestDTO;
import com.festival.application.dto.auth.AuthResponseDTO;

public interface AuthUseCase {
    AuthResponseDTO authenticate(AuthRequestDTO request);
}
