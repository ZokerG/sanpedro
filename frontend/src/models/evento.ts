export type EstadoEvento = 'PLANEADO' | 'EN_PREPARACION' | 'EN_CURSO' | 'EJECUTADO' | 'LIQUIDADO';
export type Prioridad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

export interface Evento {
  id: number;
  nombre: string;
  descripcion?: string;
  festivalId: number;
  sectorId: number;
  fechaInicio: string;
  fechaEvento: string;
  fechaFin?: string;
  presupuestoAprobado?: number;
  presupuestoEjecutado?: number;
  estado: EstadoEvento;
  prioridad: Prioridad;
  lugar?: string;
  requiereBoleta: boolean;
  activo: boolean;
}

export interface CreateEventoDTO {
  nombre: string;
  descripcion?: string;
  festivalId: number;
  sectorId: number;
  fechaInicio: string;
  fechaEvento: string;
  fechaFin?: string;
  presupuestoAprobado?: number;
  estado: EstadoEvento;
  prioridad: Prioridad;
  lugar?: string;
  requiereBoleta: boolean;
}
