export type TipoDocumentoRequerido = 
  | 'CEDULA' 
  | 'RUT' 
  | 'CERTIFICADO_BANCARIO' 
  | 'CONTRATO_FIRMADO' 
  | 'FOTO_PERFIL';

export type EstadoDocumento = 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';

export interface DocumentoPersonal {
  id: number;
  personalId: number;
  tipoDocumentoRequerido: TipoDocumentoRequerido;
  nombreOriginalArchivo: string;
  estado: EstadoDocumento;
  notaRevision?: string;
  presignedUrl?: string;
}

export const TIPO_DOCUMENTO_REQ_LABELS: Record<TipoDocumentoRequerido, string> = {
  CEDULA: 'Cédula de Ciudadanía',
  RUT: 'RUT Actualizado',
  CERTIFICADO_BANCARIO: 'Certificación Bancaria',
  CONTRATO_FIRMADO: 'Contrato Firmado',
  FOTO_PERFIL: 'Foto para Carné',
};
