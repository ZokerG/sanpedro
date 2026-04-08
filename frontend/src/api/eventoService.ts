import { axiosInstance } from './axiosConfig';
import { Evento, CreateEventoDTO } from '@/models/evento';

export const eventoService = {
  getAll: async (): Promise<Evento[]> => {
    const { data } = await axiosInstance.get<Evento[]>('/eventos');
    return data;
  },
  
  getByFestivalId: async (festivalId: number): Promise<Evento[]> => {
    // Si backend soporta GET /api/eventos?festivalId=X
    const { data } = await axiosInstance.get<Evento[]>(`/eventos`, { params: { festivalId }});
    return data;
  },

  create: async (payload: CreateEventoDTO): Promise<Evento> => {
    const { data } = await axiosInstance.post<Evento>('/eventos', payload);
    return data;
  },

  update: async (id: number, payload: CreateEventoDTO): Promise<Evento> => {
    const { data } = await axiosInstance.put<Evento>(`/eventos/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/eventos/${id}`);
  },
};
