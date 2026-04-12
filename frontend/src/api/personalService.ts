import { axiosInstance } from './axiosConfig';
import { Personal, CreatePersonalDTO, TipoPersonal } from '@/models/personal';

export const personalService = {
  getAll: async (tipo?: TipoPersonal): Promise<Personal[]> => {
    const params = tipo ? { tipo } : {};
    const { data } = await axiosInstance.get<Personal[]>('/personal', { params });
    return data;
  },

  getById: async (id: number): Promise<Personal> => {
    const { data } = await axiosInstance.get<Personal>(`/personal/${id}`);
    return data;
  },

  create: async (payload: CreatePersonalDTO): Promise<Personal> => {
    const { data } = await axiosInstance.post<Personal>('/personal', payload);
    return data;
  },

  update: async (id: number, payload: CreatePersonalDTO): Promise<Personal> => {
    const { data } = await axiosInstance.put<Personal>(`/personal/${id}`, payload);
    return data;
  },

  desactivar: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/personal/${id}/desactivar`);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal/${id}`);
  },
};
