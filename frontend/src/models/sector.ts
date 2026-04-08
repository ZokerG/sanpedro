export interface Sector {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CreateSectorDTO {
  nombre: string;
  descripcion: string;
}
