import { axiosInstance } from './axiosConfig';
import { Festival, CreateFestivalDTO } from '@/models/festival';

export const festivalService = {
  // Obtener todos los festivales
  getAll: async (): Promise<Festival[]> => {
    const { data } = await axiosInstance.get<Festival[]>('/festivales');
    return data;
  },

  // Obtener por ID
  getById: async (id: number): Promise<Festival> => {
    const { data } = await axiosInstance.get<Festival>(`/festivales/${id}`);
    return data;
  },

  // Crear nuevo
  create: async (payload: CreateFestivalDTO): Promise<Festival> => {
    const { data } = await axiosInstance.post<Festival>('/festivales', payload);
    return data;
  },

  // Actualizar
  update: async (id: number, payload: CreateFestivalDTO): Promise<Festival> => {
    const { data } = await axiosInstance.put<Festival>(`/festivales/${id}`, payload);
    return data;
  },

  // Eliminar
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/festivales/${id}`);
  },
};
