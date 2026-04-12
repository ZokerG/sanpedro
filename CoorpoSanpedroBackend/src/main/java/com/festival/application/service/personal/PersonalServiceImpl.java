package com.festival.application.service.personal;

import com.festival.application.dto.personal.PerfilResponseDTO;
import com.festival.application.dto.personal.PersonalRequestDTO;
import com.festival.application.dto.personal.PersonalResponseDTO;
import com.festival.application.usecase.personal.PersonalUseCase;
import com.festival.entity.*;
import com.festival.infrastructure.persistence.repository.BancoRepository;
import com.festival.infrastructure.persistence.repository.DocumentoPersonalRepository;
import com.festival.infrastructure.persistence.repository.PersonalRepository;
import com.festival.infrastructure.persistence.repository.RolRepository;
import com.festival.infrastructure.persistence.repository.TipoCuentaBancariaRepository;
import com.festival.infrastructure.persistence.repository.UsuarioRepository;
import com.festival.infrastructure.web.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalServiceImpl implements PersonalUseCase {

    private final PersonalRepository personalRepository;
    private final DocumentoPersonalRepository documentoPersonalRepository;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final BancoRepository bancoRepository;
    private final TipoCuentaBancariaRepository tipoCuentaBancariaRepository;
    private final PasswordEncoder passwordEncoder;

    /** Documentos mínimos requeridos para que un personal pueda trabajar. */
    private static final List<TipoDocumentoRequerido> DOCUMENTOS_MINIMOS = List.of(
            TipoDocumentoRequerido.CEDULA,
            TipoDocumentoRequerido.RUT,
            TipoDocumentoRequerido.CERTIFICADO_BANCARIO,
            TipoDocumentoRequerido.CONTRATO_FIRMADO,
            TipoDocumentoRequerido.FOTO_PERFIL
    );

    @Override
    @Transactional
    public PersonalResponseDTO crearPersonal(PersonalRequestDTO dto) {
        if (personalRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            throw new IllegalArgumentException("Ya existe un registro con el documento: " + dto.getNumeroDocumento());
        }
        if (dto.getNumeroCamiseta() != null && personalRepository.existsByNumeroCamiseta(dto.getNumeroCamiseta())) {
            throw new IllegalArgumentException("El número de camiseta " + dto.getNumeroCamiseta() + " ya está en uso.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("El correo de contacto es obligatorio para crear las credenciales de acceso.");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail().trim())) {
            throw new IllegalArgumentException("Ya existe un usuario registrado con el correo: " + dto.getEmail());
        }

        Personal personal = new Personal();
        mapToEntity(dto, personal);
        personal.setCodigoQr(UUID.randomUUID().toString());

        // Credenciales: correo de contacto como usuario, documento como contraseña
        Usuario usuario = Usuario.builder()
                .nombre(dto.getPrimerNombre())
                .apellido(dto.getPrimerApellido())
                .email(dto.getEmail().trim())
                .password(passwordEncoder.encode(dto.getNumeroDocumento()))
                .activo(true)
                .build();
        rolRepository.findByNombre(rolParaTipo(dto.getTipoPersonal()))
                .ifPresent(usuario::setRol);

        personal.setUsuario(usuarioRepository.save(usuario));
        return mapToDTO(personalRepository.save(personal));
    }

    @Override
    @Transactional
    public PersonalResponseDTO actualizarPersonal(Long id, PersonalRequestDTO dto) {
        Personal personal = personalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + id));

        if (!personal.getNumeroDocumento().equals(dto.getNumeroDocumento())
                && personalRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            throw new IllegalArgumentException("Ya existe otro registro con el documento: " + dto.getNumeroDocumento());
        }
        if (dto.getNumeroCamiseta() != null
                && !dto.getNumeroCamiseta().equals(personal.getNumeroCamiseta())
                && personalRepository.existsByNumeroCamiseta(dto.getNumeroCamiseta())) {
            throw new IllegalArgumentException("El número de camiseta " + dto.getNumeroCamiseta() + " ya está en uso.");
        }

        mapToEntity(dto, personal);

        // Sincronizar email del usuario si cambió el correo de contacto
        if (personal.getUsuario() != null && dto.getEmail() != null
                && !dto.getEmail().isBlank()
                && !dto.getEmail().trim().equalsIgnoreCase(personal.getUsuario().getEmail())) {
            if (usuarioRepository.existsByEmail(dto.getEmail().trim())) {
                throw new IllegalArgumentException("Ya existe un usuario registrado con el correo: " + dto.getEmail());
            }
            personal.getUsuario().setEmail(dto.getEmail().trim());
        }

        return mapToDTO(personalRepository.save(personal));
    }

    @Override
    @Transactional(readOnly = true)
    public PersonalResponseDTO obtenerPersonal(Long id) {
        return mapToDTO(personalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public PerfilResponseDTO obtenerPerfil(Long id) {
        Personal p = personalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal no encontrado con ID: " + id));
        return mapToPerfil(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalResponseDTO> obtenerTodos() {
        return personalRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonalResponseDTO> obtenerPorTipo(TipoPersonal tipoPersonal) {
        return personalRepository.findByTipoPersonal(tipoPersonal).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void desactivarPersonal(Long id) {
        // El estado activo se calcula desde documentos, no se persiste.
        // Este método se mantiene por compatibilidad con la interfaz pero no tiene efecto.
    }

    @Override
    @Transactional
    public void eliminarPersonal(Long id) {
        if (!personalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Personal no encontrado con ID: " + id);
        }
        personalRepository.deleteById(id);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private void mapToEntity(PersonalRequestDTO dto, Personal entity) {
        entity.setPrimerNombre(dto.getPrimerNombre());
        entity.setSegundoNombre(dto.getSegundoNombre());
        entity.setPrimerApellido(dto.getPrimerApellido());
        entity.setSegundoApellido(dto.getSegundoApellido());
        entity.setTipoDocumento(dto.getTipoDocumento());
        entity.setNumeroDocumento(dto.getNumeroDocumento());

        // Contacto
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setDireccion(dto.getDireccion());
        entity.setArl(dto.getArl());

        // Bancarios (FKs a tablas)
        if (dto.getBancoId() != null) {
            Banco banco = bancoRepository.findById(dto.getBancoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Banco no encontrado con ID: " + dto.getBancoId()));
            entity.setBanco(banco);
        }
        if (dto.getTipoCuentaBancariaId() != null) {
            TipoCuentaBancaria tipo = tipoCuentaBancariaRepository.findById(dto.getTipoCuentaBancariaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de cuenta no encontrado con ID: " + dto.getTipoCuentaBancariaId()));
            entity.setTipoCuentaBancaria(tipo);
        }
        entity.setNumeroCuenta(dto.getNumeroCuenta());

        // Clasificación
        entity.setTipoPersonal(dto.getTipoPersonal());
        entity.setNumeroCamiseta(dto.getNumeroCamiseta());

        if (dto.getCargoId() != null) {
            Rol cargo = rolRepository.findById(dto.getCargoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cargo no encontrado con ID: " + dto.getCargoId()));
            entity.setCargo(cargo);
        }
    }

    private PersonalResponseDTO mapToDTO(Personal entity) {
        PersonalResponseDTO dto = new PersonalResponseDTO();
        dto.setId(entity.getId());
        dto.setPrimerNombre(entity.getPrimerNombre());
        dto.setSegundoNombre(entity.getSegundoNombre());
        dto.setPrimerApellido(entity.getPrimerApellido());
        dto.setSegundoApellido(entity.getSegundoApellido());
        dto.setNombreCompleto(entity.getNombreCompleto());
        dto.setTipoDocumento(entity.getTipoDocumento());
        dto.setNumeroDocumento(entity.getNumeroDocumento());

        // Contacto
        dto.setEmail(entity.getEmail());
        dto.setTelefono(entity.getTelefono());
        dto.setFechaNacimiento(entity.getFechaNacimiento());
        dto.setDireccion(entity.getDireccion());
        dto.setArl(entity.getArl());

        // Bancarios
        if (entity.getBanco() != null) {
            dto.setBancoId(entity.getBanco().getId());
            dto.setBancoNombre(entity.getBanco().getNombre());
        }
        if (entity.getTipoCuentaBancaria() != null) {
            dto.setTipoCuentaBancariaId(entity.getTipoCuentaBancaria().getId());
            dto.setTipoCuentaBancariaNombre(entity.getTipoCuentaBancaria().getNombre());
        }
        dto.setNumeroCuenta(entity.getNumeroCuenta());

        // Clasificación y acreditación
        dto.setTipoPersonal(entity.getTipoPersonal());
        dto.setNumeroCamiseta(entity.getNumeroCamiseta());
        dto.setCodigoQr(entity.getCodigoQr());

        if (entity.getCargo() != null) {
            dto.setCargoId(entity.getCargo().getId());
            dto.setCargoNombre(entity.getCargo().getNombre());
        }
        if (entity.getUsuario() != null) {
            dto.setUsuarioEmail(entity.getUsuario().getEmail());
        }

        // Estado activo = documentos completos (calculado, no persistente)
        boolean docsCompletos = todosDocumentosMinimosVerificados(entity.getId());
        dto.setDocumentosCompletos(docsCompletos);
        dto.setActivo(docsCompletos);

        return dto;
    }

    private PerfilResponseDTO mapToPerfil(Personal p) {
        PerfilResponseDTO dto = new PerfilResponseDTO();
        dto.setId(p.getId());
        dto.setNombreCompleto(p.getNombreCompleto());
        dto.setTipoDocumento(p.getTipoDocumento());
        dto.setNumeroDocumento(p.getNumeroDocumento());
        dto.setEmail(p.getEmail());
        dto.setTelefono(p.getTelefono());
        dto.setFechaNacimiento(p.getFechaNacimiento());
        dto.setDireccion(p.getDireccion());
        dto.setArl(p.getArl());
        dto.setTipoPersonal(p.getTipoPersonal());
        dto.setNumeroCamiseta(p.getNumeroCamiseta());
        dto.setCodigoQr(p.getCodigoQr());
        dto.setFotoPerfil(p.getFotoPerfil());
        if (p.getCargo() != null) dto.setCargoNombre(p.getCargo().getNombre());
        if (p.getBanco() != null) dto.setBancoNombre(p.getBanco().getNombre());
        if (p.getTipoCuentaBancaria() != null) dto.setTipoCuentaBancariaNombre(p.getTipoCuentaBancaria().getNombre());
        dto.setNumeroCuenta(p.getNumeroCuenta());
        dto.setActivo(todosDocumentosMinimosVerificados(p.getId()));
        return dto;
    }

    /** Verifica que los 5 documentos mínimos estén cargados y en estado VERIFICADO. */
    private boolean todosDocumentosMinimosVerificados(Long personalId) {
        return DOCUMENTOS_MINIMOS.stream().allMatch(tipo ->
                documentoPersonalRepository
                        .findByPersonalIdAndTipoDocumentoRequerido(personalId, tipo)
                        .map(doc -> doc.getEstado() == EstadoDocumento.VERIFICADO)
                        .orElse(false)
        );
    }

    /** Mapea el tipo de personal a un nombre de rol de acceso al sistema. */
    private String rolParaTipo(TipoPersonal tipo) {
        return switch (tipo) {
            case LOGISTICO -> "ADMIN_LOGISTICA";
            case ADMINISTRATIVO -> "ADMIN_ADMINISTRATIVO";
            case PRENSA -> "ADMIN_PRENSA";
        };
    }
}
