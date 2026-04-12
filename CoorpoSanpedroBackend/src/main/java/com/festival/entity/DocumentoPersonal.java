package com.festival.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Expediente documental de cada integrante del personal.
 * Permite registrar y controlar los documentos mínimos requeridos
 * para habilitar a la persona para trabajar en el festival.
 */
@Entity
@Table(name = "documentos_personal",
       uniqueConstraints = @UniqueConstraint(columnNames = {"personal_id", "tipo_documento_requerido"}))
@Getter
@Setter
@NoArgsConstructor
public class DocumentoPersonal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento_requerido", nullable = false, length = 50)
    private TipoDocumentoRequerido tipoDocumentoRequerido;

    /**
     * Ruta relativa del archivo guardado en el servidor.
     * Ejemplo: /uploads/personal/123/cedula.pdf
     */
    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(name = "nombre_original_archivo", length = 255)
    private String nombreOriginalArchivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 30)
    private EstadoDocumento estado = EstadoDocumento.PENDIENTE;

    /**
     * Nota del revisor al verificar o rechazar el documento.
     */
    @Column(name = "nota_revision", columnDefinition = "TEXT")
    private String notaRevision;
}
