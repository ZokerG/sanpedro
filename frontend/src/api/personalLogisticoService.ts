import { axiosInstance } from './axiosConfig';
import { PersonalLogistico, CreatePersonalLogisticoDTO } from '@/models/personalLogistico';

export const personalLogisticoService = {
  getAll: async (): Promise<PersonalLogistico[]> => {
    const { data } = await axiosInstance.get<PersonalLogistico[]>('/personal-logistico');
    return data;
  },

  create: async (payload: CreatePersonalLogisticoDTO): Promise<PersonalLogistico> => {
    const { data } = await axiosInstance.post<PersonalLogistico>('/personal-logistico', payload);
    return data;
  },

  update: async (id: number, payload: CreatePersonalLogisticoDTO): Promise<PersonalLogistico> => {
    const { data } = await axiosInstance.put<PersonalLogistico>(`/personal-logistico/${id}`, payload);
    return data;
  },

  desactivar: async (id: number): Promise<void> => {
    await axiosInstance.put(`/personal-logistico/${id}/desactivar`);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal-logistico/${id}`);
  },
};
