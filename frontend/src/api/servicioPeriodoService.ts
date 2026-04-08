import { axiosInstance } from './axiosConfig';
import { ServicioPeriodo, CreateServicioPeriodoDTO } from '@/models/presupuesto';

export const servicioPeriodoService = {
  getAll: async (): Promise<ServicioPeriodo[]> => {
    const { data } = await axiosInstance.get<ServicioPeriodo[]>('/servicios-periodo');
    return data;
  },

  getByFestivalId: async (festivalId: number): Promise<ServicioPeriodo[]> => {
    const { data } = await axiosInstance.get<ServicioPeriodo[]>(`/servicios-periodo/festival/${festivalId}`);
    return data;
  },

  getById: async (id: number): Promise<ServicioPeriodo> => {
    const { data } = await axiosInstance.get<ServicioPeriodo>(`/servicios-periodo/${id}`);
    return data;
  },

  create: async (payload: CreateServicioPeriodoDTO): Promise<ServicioPeriodo> => {
    const { data } = await axiosInstance.post<ServicioPeriodo>('/servicios-periodo', payload);
    return data;
  },

  update: async (id: number, payload: CreateServicioPeriodoDTO): Promise<ServicioPeriodo> => {
    const { data } = await axiosInstance.put<ServicioPeriodo>(`/servicios-periodo/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/servicios-periodo/${id}`);
  },
};
