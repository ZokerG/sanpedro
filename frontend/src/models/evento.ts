export type EstadoEvento = 'PLANEADO' | 'EN_PREPARACION' | 'EN_CURSO' | 'EJECUTADO' | 'LIQUIDADO';
export type Prioridad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

export interface Evento {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  duracionHoras?: number;
  presupuestoAprobado?: number;
  presupuestoEjecutado?: number;
  estado: EstadoEvento;
  prioridad: Prioridad;
  // Control logístico
  ubicacionLogistica?: string;
  limitePersonal?: number;
  cuotaPago?: number;
  totalAsignados?: number;
}

export interface CreateEventoDTO {
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  duracionHoras?: number;
  presupuestoAprobado?: number;
  estado: EstadoEvento;
  prioridad: Prioridad;
  // Control logístico
  ubicacionLogistica?: string;
  limitePersonal?: number;
  cuotaPago?: number;
}

export const ESTADO_LABELS: Record<EstadoEvento, string> = {
  PLANEADO: 'Planeado',
  EN_PREPARACION: 'En Preparación',
  EN_CURSO: 'En Curso',
  EJECUTADO: 'Ejecutado',
  LIQUIDADO: 'Liquidado',
};

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  CRITICA: 'Crítica',
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};
