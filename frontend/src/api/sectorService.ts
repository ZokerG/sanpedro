import { axiosInstance } from './axiosConfig';
import { Sector, CreateSectorDTO } from '@/models/sector';

export const sectorService = {
  getAll: async (): Promise<Sector[]> => {
    const { data } = await axiosInstance.get<Sector[]>('/sectores');
    return data;
  },

  getById: async (id: number): Promise<Sector> => {
    const { data } = await axiosInstance.get<Sector>(`/sectores/${id}`);
    return data;
  },

  create: async (payload: CreateSectorDTO): Promise<Sector> => {
    const { data } = await axiosInstance.post<Sector>('/sectores', payload);
    return data;
  },

  update: async (id: number, payload: CreateSectorDTO): Promise<Sector> => {
    const { data } = await axiosInstance.put<Sector>(`/sectores/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sectores/${id}`);
  },
};
