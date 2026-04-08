import { axiosInstance } from './axiosConfig';
import { TareaPadre, CreateTareaPadreDTO } from '@/models/tareas';

export const tareaPadreService = {
  getAll: async (): Promise<TareaPadre[]> => {
    const { data } = await axiosInstance.get<TareaPadre[]>('/tareas-padre');
    return data;
  },

  getByEventoId: async (eventoId: number): Promise<TareaPadre[]> => {
    const { data } = await axiosInstance.get<TareaPadre[]>(`/tareas-padre/evento/${eventoId}`);
    return data;
  },

  getById: async (id: number): Promise<TareaPadre> => {
    const { data } = await axiosInstance.get<TareaPadre>(`/tareas-padre/${id}`);
    return data;
  },

  create: async (payload: CreateTareaPadreDTO): Promise<TareaPadre> => {
    const { data } = await axiosInstance.post<TareaPadre>('/tareas-padre', payload);
    return data;
  },

  update: async (id: number, payload: CreateTareaPadreDTO): Promise<TareaPadre> => {
    const { data } = await axiosInstance.put<TareaPadre>(`/tareas-padre/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tareas-padre/${id}`);
  },
};
