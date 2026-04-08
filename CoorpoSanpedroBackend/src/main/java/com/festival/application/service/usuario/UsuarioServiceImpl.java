package com.festival.application.service.usuario;

import com.festival.application.dto.usuario.UsuarioRequestDTO;
import com.festival.application.dto.usuario.UsuarioResponseDTO;
import com.festival.application.mapper.UsuarioMapper;
import com.festival.application.usecase.usuario.UsuarioUseCase;
import com.festival.entity.Rol;
import com.festival.entity.Usuario;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO requestDTO) {
        if (usuarioRepository.findByEmail(requestDTO.email()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el correo: " + requestDTO.email());
        }

        Usuario usuario = usuarioMapper.toEntity(requestDTO);
        usuario.setPassword(passwordEncoder.encode(requestDTO.password()));
        usuario.setActivo(true); // Usuario activo por defecto

        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponseDTO(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarPorRol(Rol rol) {
        return usuarioRepository.findByRolAndActivoTrue(rol).stream()
                .map(usuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
