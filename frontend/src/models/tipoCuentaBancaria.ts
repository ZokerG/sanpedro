export interface TipoCuentaBancaria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateTipoCuentaDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoCuentaDTO {
  nombre: string;
  descripcion?: string;
}
