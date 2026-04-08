export interface Festival {
  id: number;
  nombre: string;
  version: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  esVigente: boolean;
}

export interface CreateFestivalDTO {
  nombre: string;
  version: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}
