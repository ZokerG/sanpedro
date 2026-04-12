export type EstadoSolicitud = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CANCELADA';

export interface SolicitudParticipacion {
  id: number;
  personalId: number;
  personalNombre: string;
  personalDocumento: string;
  eventoId: number;
  eventoNombre: string;
  estado: EstadoSolicitud;
  fechaSolicitud: string;
  fechaResolucion?: string;
  notaRechazo?: string;
  rolAsignado?: string;
  asignacionId?: number;
}

export interface CrearSolicitudDTO {
  eventoId: number;
  rolAsignado?: string;
}

export const ESTADO_SOLICITUD_LABELS: Record<EstadoSolicitud, string> = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
};
