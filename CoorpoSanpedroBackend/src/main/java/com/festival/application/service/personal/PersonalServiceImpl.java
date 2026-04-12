package com.festival.application.service.personal;

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

        Personal personal = new Personal();
        mapToEntity(dto, personal);
        personal.setCodigoQr(UUID.randomUUID().toString());

        // Crear credenciales automáticamente
        String email = dto.getNumeroDocumento().trim() + "@corposanpedro.com";
        Usuario usuario = Usuario.builder()
                .nombre(dto.getPrimerNombre())
                .apellido(dto.getPrimerApellido())
                .email(email)
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
