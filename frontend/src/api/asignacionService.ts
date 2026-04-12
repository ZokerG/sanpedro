import { axiosInstance } from './axiosConfig';
import { AsignacionPersonal, CreateAsignacionDTO, LiquidacionEvento } from '@/models/asignacion';

export const asignacionService = {
  create: async (payload: CreateAsignacionDTO): Promise<AsignacionPersonal> => {
    const { data } = await axiosInstance.post<AsignacionPersonal>('/asignaciones', payload);
    return data;
  },

  getByEvento: async (eventoId: number): Promise<AsignacionPersonal[]> => {
    const { data } = await axiosInstance.get<AsignacionPersonal[]>(`/asignaciones/evento/${eventoId}`);
    return data;
  },

  getByPersonal: async (personalId: number): Promise<AsignacionPersonal[]> => {
    const { data } = await axiosInstance.get<AsignacionPersonal[]>(`/asignaciones/personal/${personalId}`);
    return data;
  },

  confirmarAsistencia: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/asignaciones/${id}/confirmar-asistencia`);
  },

  desactivar: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/asignaciones/${id}/desactivar`);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/asignaciones/${id}`);
  },

  liquidarEvento: async (eventoId: number): Promise<LiquidacionEvento> => {
    const { data } = await axiosInstance.post<LiquidacionEvento>(`/asignaciones/evento/${eventoId}/liquidar`);
    return data;
  },

  obtenerLiquidacion: async (eventoId: number): Promise<LiquidacionEvento> => {
    const { data } = await axiosInstance.get<LiquidacionEvento>(`/asignaciones/evento/${eventoId}/liquidar`);
    return data;
  },
};
