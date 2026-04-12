import { axiosInstance } from './axiosConfig';
import { TipoCuentaBancaria, CreateTipoCuentaDTO, UpdateTipoCuentaDTO } from '@/models/tipoCuentaBancaria';

export const tipoCuentaService = {
  getAll: async (activo?: boolean): Promise<TipoCuentaBancaria[]> => {
    const params = activo !== undefined ? { activo: String(activo) } : {};
    const { data } = await axiosInstance.get<TipoCuentaBancaria[]>('/tipos-cuenta-bancaria', { params });
    return data;
  },
  getById: async (id: number): Promise<TipoCuentaBancaria> => {
    const { data } = await axiosInstance.get<TipoCuentaBancaria>(`/tipos-cuenta-bancaria/${id}`);
    return data;
  },
  create: async (data: CreateTipoCuentaDTO): Promise<TipoCuentaBancaria> => {
    const { data: result } = await axiosInstance.post<TipoCuentaBancaria>('/tipos-cuenta-bancaria', data);
    return result;
  },
  update: async (id: number, data: UpdateTipoCuentaDTO): Promise<TipoCuentaBancaria> => {
    const { data: result } = await axiosInstance.put<TipoCuentaBancaria>(`/tipos-cuenta-bancaria/${id}`, data);
    return result;
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tipos-cuenta-bancaria/${id}`);
  },
  toggleActivo: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/tipos-cuenta-bancaria/${id}/toggle-activo`);
  },
};
