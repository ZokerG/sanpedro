// ============ ÍTEM DE EVENTO (Tipo 1) ============
export interface ItemEvento {
  id: number;
  eventoId: number;
  resolucionId: number;
  detalle: string;
  unidad: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
  valorEjecutado: number;
  estado: string;
}

export interface CreateItemEventoDTO {
  eventoId: number;
  resolucionId: number;
  detalle: string;
  unidad: string;
  cantidad: number;
  valorUnitario: number;
  valorEjecutado: number;
  estado?: string;
}

// ============ POOL TRANSVERSAL (Tipo 2) ============
export interface PoolTransversal {
  id: number;
  festivalId: number;
  resolucionId: number;
  nombre: string;
  unidad: string;
  cantidadTotal: number;
  cantidadConsumida: number;
  valorTotal: number;
  valorConsumido: number;
  estado: string;
}

export interface CreatePoolTransversalDTO {
  festivalId: number;
  resolucionId: number;
  nombre: string;
  unidad: string;
  cantidadTotal: number;
  cantidadConsumida: number;
  valorTotal: number;
  valorConsumido: number;
  estado?: string;
}

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
