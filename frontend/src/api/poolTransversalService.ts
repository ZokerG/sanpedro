import { axiosInstance } from './axiosConfig';
import { PoolTransversal, CreatePoolTransversalDTO } from '@/models/presupuesto';

export const poolTransversalService = {
  getAll: async (): Promise<PoolTransversal[]> => {
    const { data } = await axiosInstance.get<PoolTransversal[]>('/pools-transversales');
    return data;
  },

  getByFestivalId: async (festivalId: number): Promise<PoolTransversal[]> => {
    const { data } = await axiosInstance.get<PoolTransversal[]>(`/pools-transversales/festival/${festivalId}`);
    return data;
  },

  getById: async (id: number): Promise<PoolTransversal> => {
    const { data } = await axiosInstance.get<PoolTransversal>(`/pools-transversales/${id}`);
    return data;
  },

  create: async (payload: CreatePoolTransversalDTO): Promise<PoolTransversal> => {
    const { data } = await axiosInstance.post<PoolTransversal>('/pools-transversales', payload);
    return data;
  },

  update: async (id: number, payload: CreatePoolTransversalDTO): Promise<PoolTransversal> => {
    const { data } = await axiosInstance.put<PoolTransversal>(`/pools-transversales/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/pools-transversales/${id}`);
  },
};
