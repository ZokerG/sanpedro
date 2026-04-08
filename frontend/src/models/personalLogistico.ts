export interface PersonalLogistico {
  id: number;
  nombre: string;
  apellido: string;
  numeroCamiseta: number;
  codigoQr: string;
  activo: boolean;
}

export interface CreatePersonalLogisticoDTO {
  nombre: string;
  apellido: string;
  numeroCamiseta: number;
}
