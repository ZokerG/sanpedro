// ─── Enums ────────────────────────────────────────────────────────────────────
export type EstadoCalculado = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'VERIFICADA';
export type EstadoSubtarea = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'VERIFICADA' | 'CANCELADA';
export type Prioridad = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

// ─── TareaPadre ───────────────────────────────────────────────────────────────
export interface TareaPadre {
  id: number;
  eventoId: number;
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  estadoCalculado: EstadoCalculado;
  itemEventoId?: number;
  asignacionPoolId?: number;
  servicioId?: number;
}

export interface CreateTareaPadreDTO {
  eventoId: number;
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  estadoCalculado: EstadoCalculado;
  itemEventoId?: number | null;
  asignacionPoolId?: number | null;
  servicioId?: number | null;
}

// ─── SubTarea ─────────────────────────────────────────────────────────────────
export interface SubTarea {
  id: number;
  tareaPadreId: number;
  sectorId?: number;
  titulo: string;
  descripcion?: string;
  responsableId?: number;
  fechaLimite?: string;
  estado: EstadoSubtarea;
  valorComprometido?: number;
  valorEjecutado?: number;
}

export interface CreateSubTareaDTO {
  tareaPadreId: number;
  sectorId?: number | null;
  titulo: string;
  descripcion?: string;
  responsableId?: number | null;
  fechaLimite?: string;
  estado: EstadoSubtarea;
  valorComprometido?: number;
  valorEjecutado?: number;
}
