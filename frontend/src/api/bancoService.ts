import { axiosInstance } from './axiosConfig';
import { Banco, CreateBancoDTO, UpdateBancoDTO } from '@/models/banco';

export const bancoService = {
  getAll: async (activo?: boolean): Promise<Banco[]> => {
    const params = activo !== undefined ? { activo: String(activo) } : {};
    const { data } = await axiosInstance.get<Banco[]>('/bancos', { params });
    return data;
  },
  getById: async (id: number): Promise<Banco> => {
    const { data } = await axiosInstance.get<Banco>(`/bancos/${id}`);
    return data;
  },
  create: async (data: CreateBancoDTO): Promise<Banco> => {
    const { data: result } = await axiosInstance.post<Banco>('/bancos', data);
    return result;
  },
  update: async (id: number, data: UpdateBancoDTO): Promise<Banco> => {
    const { data: result } = await axiosInstance.put<Banco>(`/bancos/${id}`, data);
    return result;
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/bancos/${id}`);
  },
  toggleActivo: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/bancos/${id}/toggle-activo`);
  },
};
