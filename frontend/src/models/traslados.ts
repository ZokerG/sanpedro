export type TipoTrasladoItem = 'ITEM_EVENTO' | 'POOL' | 'SERVICIO';
export type EstadoTraslado = 'PENDIENTE_RESOLUCION' | 'APROBADO_CON_RESOLUCION' | 'RECHAZADO';

export interface TrasladoPresupuestal {
  id: number;
  festivalId: number;
  resolucionRespaldoId?: number;
  tipoOrigen: TipoTrasladoItem;
  idOrigen: number;
  tipoDestino: TipoTrasladoItem;
  idDestino: number;
  valor: number;
  justificacion: string;
  aprobadoPorId?: number;
  estado: EstadoTraslado;
}

export interface CreateTrasladoPresupuestalDTO {
  festivalId: number;
  resolucionRespaldoId?: number | null;
  tipoOrigen: TipoTrasladoItem;
  idOrigen: number;
  tipoDestino: TipoTrasladoItem;
  idDestino: number;
  valor: number;
  justificacion: string;
  aprobadoPorId?: number | null;
  estado: EstadoTraslado;
}
