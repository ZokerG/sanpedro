import { axiosInstance } from './axiosConfig';
import {
  AsignacionPersonal,
  CreateAsignacionPersonalDTO,
} from '@/models/logistica';

export const asignacionPersonalService = {
  getAll: async (): Promise<AsignacionPersonal[]> => {
    const { data } = await axiosInstance.get<AsignacionPersonal[]>('/asignaciones-personal');
    return data;
  },

  getByEvento: async (eventoId: number): Promise<AsignacionPersonal[]> => {
    const { data } = await axiosInstance.get<AsignacionPersonal[]>(`/asignaciones-personal/evento/${eventoId}`);
    return data;
  },

  getByPersonal: async (personalId: number): Promise<AsignacionPersonal[]> => {
    const { data } = await axiosInstance.get<AsignacionPersonal[]>(`/asignaciones-personal/personal/${personalId}`);
    return data;
  },

  create: async (payload: CreateAsignacionPersonalDTO): Promise<AsignacionPersonal> => {
    const { data } = await axiosInstance.post<AsignacionPersonal>('/asignaciones-personal', payload);
    return data;
  },

  asignacionMasiva: async (
    eventoId: number,
    cantidad: number,
    excluirIds?: number[]
  ): Promise<AsignacionPersonal[]> => {
    const params: Record<string, unknown> = { eventoId, cantidad };
    if (excluirIds && excluirIds.length > 0) params.excluirIds = excluirIds;
    const { data } = await axiosInstance.post<AsignacionPersonal[]>('/asignaciones-personal/masiva', null, { params });
    return data;
  },

  update: async (id: number, payload: CreateAsignacionPersonalDTO): Promise<AsignacionPersonal> => {
    const { data } = await axiosInstance.put<AsignacionPersonal>(`/asignaciones-personal/${id}`, payload);
    return data;
  },

  desactivar: async (id: number): Promise<void> => {
    await axiosInstance.put(`/asignaciones-personal/${id}/desactivar`);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/asignaciones-personal/${id}`);
  },
};
