import { axiosInstance } from './axiosConfig';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
}

export const usuarioService = {
  getByRol: async (rol: string): Promise<Usuario[]> => {
    const { data } = await axiosInstance.get<Usuario[]>('/usuarios', { params: { rol } });
    return data;
  },
};
