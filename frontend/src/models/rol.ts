export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateRolDTO {
  nombre: string;
  descripcion?: string;
}

export interface UpdateRolDTO {
  nombre: string;
  descripcion?: string;
}
