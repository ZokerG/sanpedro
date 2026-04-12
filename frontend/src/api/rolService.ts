import { axiosInstance } from './axiosConfig';
import { Rol, CreateRolDTO, UpdateRolDTO } from '@/models/rol';

export const rolService = {
  getAll: async (activo?: boolean): Promise<Rol[]> => {
    const params = activo !== undefined ? { activo: String(activo) } : {};
    const { data } = await axiosInstance.get<Rol[]>('/roles', { params });
    return data;
  },
  getById: async (id: number): Promise<Rol> => {
    const { data } = await axiosInstance.get<Rol>(`/roles/${id}`);
    return data;
  },
  create: async (data: CreateRolDTO): Promise<Rol> => {
    const { data: result } = await axiosInstance.post<Rol>('/roles', data);
    return result;
  },
  update: async (id: number, data: UpdateRolDTO): Promise<Rol> => {
    const { data: result } = await axiosInstance.put<Rol>(`/roles/${id}`, data);
    return result;
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },
  toggleActivo: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/roles/${id}/toggle-activo`);
  },
};
