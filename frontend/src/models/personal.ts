export type TipoPersonal = 'LOGISTICO' | 'ADMINISTRATIVO' | 'PRENSA';
export type TipoDocumento = 'CEDULA_CIUDADANIA' | 'CEDULA_EXTRANJERIA' | 'PASAPORTE' | 'TARJETA_IDENTIDAD' | 'NIT';

export interface Personal {
  id: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  // Contacto
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  arl?: string;
  // Bancarios
  bancoId?: number;
  bancoNombre?: string;
  tipoCuentaBancariaId?: number;
  tipoCuentaBancariaNombre?: string;
  numeroCuenta?: string;
  // Clasificación
  tipoPersonal: TipoPersonal;
  cargoId?: number;
  cargoNombre?: string;
  // Acreditación
  numeroCamiseta?: number;
  codigoQr?: string;
  /** Estado activo = documentos completos. Calculado por el backend. */
  activo: boolean;
  documentosCompletos: boolean;
  usuarioEmail?: string;
}

export interface CreatePersonalDTO {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  // Contacto
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
  arl?: string;
  // Bancarios
  bancoId?: number;
  tipoCuentaBancariaId?: number;
  numeroCuenta?: string;
  // Clasificación
  tipoPersonal: TipoPersonal;
  cargoId?: number;
  numeroCamiseta?: number;
}

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  CEDULA_CIUDADANIA: 'Cédula de Ciudadanía',
  CEDULA_EXTRANJERIA: 'Cédula de Extranjería',
  PASAPORTE: 'Pasaporte',
  TARJETA_IDENTIDAD: 'Tarjeta de Identidad',
  NIT: 'NIT',
};
