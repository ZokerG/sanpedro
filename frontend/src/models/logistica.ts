export interface AsignacionPersonal {
  id: number;
  personalId: number;
  nombrePersonal: string;
  apellidoPersonal: string;
  numeroCamiseta: number;
  codigoQr: string;
  eventoId: number;
  nombreEvento: string;
  rolAsignado?: string;
  fechaAsignacion: string;
  activo: boolean;
}

export interface CreateAsignacionPersonalDTO {
  personalId: number;
  eventoId: number;
  rolAsignado?: string;
}

export interface AsignacionMasivaDTO {
  eventoId: number;
  cantidad: number;
  excluirIds?: number[];
}
