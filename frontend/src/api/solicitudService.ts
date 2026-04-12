import { axiosInstance } from './axiosConfig';
import { SolicitudParticipacion, CrearSolicitudDTO } from '@/models/solicitudParticipacion';

export const solicitudService = {
  crear: async (personalId: number, data: CrearSolicitudDTO): Promise<SolicitudParticipacion> => {
    const { data: result } = await axiosInstance.post<SolicitudParticipacion>(
      `/solicitudes/personal/${personalId}`,
      data
    );
    return result;
  },

  getMisSolicitudes: async (personalId: number): Promise<SolicitudParticipacion[]> => {
    const { data } = await axiosInstance.get<SolicitudParticipacion[]>(`/solicitudes/personal/${personalId}`);
    return data;
  },

  getPorEvento: async (eventoId: number): Promise<SolicitudParticipacion[]> => {
    const { data } = await axiosInstance.get<SolicitudParticipacion[]>(`/solicitudes/evento/${eventoId}`);
    return data;
  },

  getPendientes: async (eventoId: number): Promise<SolicitudParticipacion[]> => {
    const { data } = await axiosInstance.get<SolicitudParticipacion[]>(`/solicitudes/evento/${eventoId}/pendientes`);
    return data;
  },

  aprobar: async (solicitudId: number): Promise<SolicitudParticipacion> => {
    const { data } = await axiosInstance.patch<SolicitudParticipacion>(`/solicitudes/${solicitudId}/aprobar`);
    return data;
  },

  rechazar: async (solicitudId: number, nota?: string): Promise<SolicitudParticipacion> => {
    const params = nota ? { nota } : {};
    const { data } = await axiosInstance.patch<SolicitudParticipacion>(`/solicitudes/${solicitudId}/rechazar`, null, { params });
    return data;
  },

  cancelar: async (solicitudId: number): Promise<void> => {
    await axiosInstance.patch(`/solicitudes/${solicitudId}/cancelar`);
  },
};
