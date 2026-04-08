import { axiosInstance } from './axiosConfig';
import { SubTarea, CreateSubTareaDTO } from '@/models/tareas';

export const subTareaService = {
  getAll: async (): Promise<SubTarea[]> => {
    const { data } = await axiosInstance.get<SubTarea[]>('/subtareas');
    return data;
  },

  getByTareaPadreId: async (tareaPadreId: number): Promise<SubTarea[]> => {
    const { data } = await axiosInstance.get<SubTarea[]>(`/subtareas/tarea-padre/${tareaPadreId}`);
    return data;
  },

  getById: async (id: number): Promise<SubTarea> => {
    const { data } = await axiosInstance.get<SubTarea>(`/subtareas/${id}`);
    return data;
  },

  create: async (payload: CreateSubTareaDTO): Promise<SubTarea> => {
    const { data } = await axiosInstance.post<SubTarea>('/subtareas', payload);
    return data;
  },

  update: async (id: number, payload: CreateSubTareaDTO): Promise<SubTarea> => {
    const { data } = await axiosInstance.put<SubTarea>(`/subtareas/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/subtareas/${id}`);
  },
};
