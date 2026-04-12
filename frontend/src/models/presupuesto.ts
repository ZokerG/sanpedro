// ============ SERVICIO POR PERÍODO (Tipo 3) ============
export interface ServicioPeriodo {
  id: number;
  festivalId: number;
  resolucionId: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  valorTotal: number;
  valorEjecutado: number;
  descripcion?: string;
}

export interface CreateServicioPeriodoDTO {
  festivalId: number;
  resolucionId: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  valorTotal: number;
  valorEjecutado: number;
  descripcion?: string;
}
