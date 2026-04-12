export interface AsignacionPersonal {
  id: number;
  personalId: number;
  nombrePersonal: string;
  apellidoPersonal: string;
  documentoPersonal: string;
  numeroCamiseta?: number;
  eventoId: number;
  nombreEvento: string;
  rolAsignado?: string;
  fechaAsignacion: string;
  asistio: boolean;
  activo: boolean;
}

export interface CreateAsignacionDTO {
  personalId: number;
  eventoId: number;
  rolAsignado?: string;
}

export interface LiquidacionEvento {
  eventoId: number;
  nombreEvento: string;
  totalAsignados: number;
  totalAsistentes: number;
  cuotaPago: number;
  costoReal: number;
  presupuestoAprobado: number;
  diferencia: number;
  estado: 'DENTRO_PRESUPUESTO' | 'DEFICIT';
}
