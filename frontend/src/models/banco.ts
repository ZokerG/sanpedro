export interface Banco {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateBancoDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateBancoDTO {
  nombre: string;
  descripcion?: string;
}
