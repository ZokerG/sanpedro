import { axiosInstance } from './axiosConfig';
import { TrasladoPresupuestal, CreateTrasladoPresupuestalDTO } from '@/models/traslados';

export const trasladoService = {
  getAll: async (): Promise<TrasladoPresupuestal[]> => {
    const { data } = await axiosInstance.get<TrasladoPresupuestal[]>('/traslados-presupuestales');
    return data;
  },

  getByFestivalId: async (festivalId: number): Promise<TrasladoPresupuestal[]> => {
    const { data } = await axiosInstance.get<TrasladoPresupuestal[]>(`/traslados-presupuestales/festival/${festivalId}`);
    return data;
  },

  getById: async (id: number): Promise<TrasladoPresupuestal> => {
    const { data } = await axiosInstance.get<TrasladoPresupuestal>(`/traslados-presupuestales/${id}`);
    return data;
  },

  create: async (payload: CreateTrasladoPresupuestalDTO): Promise<TrasladoPresupuestal> => {
    const { data } = await axiosInstance.post<TrasladoPresupuestal>('/traslados-presupuestales', payload);
    return data;
  },

  update: async (id: number, payload: CreateTrasladoPresupuestalDTO): Promise<TrasladoPresupuestal> => {
    const { data } = await axiosInstance.put<TrasladoPresupuestal>(`/traslados-presupuestales/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/traslados-presupuestales/${id}`);
  },
};
