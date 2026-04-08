import { axiosInstance } from './axiosConfig';
import { ItemEvento, CreateItemEventoDTO } from '@/models/presupuesto';

export const itemEventoService = {
  getAll: async (): Promise<ItemEvento[]> => {
    const { data } = await axiosInstance.get<ItemEvento[]>('/items-evento');
    return data;
  },

  getByEventoId: async (eventoId: number): Promise<ItemEvento[]> => {
    const { data } = await axiosInstance.get<ItemEvento[]>(`/items-evento/evento/${eventoId}`);
    return data;
  },

  getById: async (id: number): Promise<ItemEvento> => {
    const { data } = await axiosInstance.get<ItemEvento>(`/items-evento/${id}`);
    return data;
  },

  create: async (payload: CreateItemEventoDTO): Promise<ItemEvento> => {
    const { data } = await axiosInstance.post<ItemEvento>('/items-evento', payload);
    return data;
  },

  update: async (id: number, payload: CreateItemEventoDTO): Promise<ItemEvento> => {
    const { data } = await axiosInstance.put<ItemEvento>(`/items-evento/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/items-evento/${id}`);
  },
};
