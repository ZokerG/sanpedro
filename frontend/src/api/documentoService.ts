import { axiosInstance } from './axiosConfig';
import { 
  DocumentoPersonal, 
  TipoDocumentoRequerido, 
  EstadoDocumento 
} from '@/models/documento';

export const documentoService = {
  upload: async (personalId: number, tipo: TipoDocumentoRequerido, file: File): Promise<DocumentoPersonal> => {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('file', file);

    const { data } = await axiosInstance.post<DocumentoPersonal>(
      `/personal/${personalId}/documentos`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  getByPersonal: async (personalId: number): Promise<DocumentoPersonal[]> => {
    const { data } = await axiosInstance.get<DocumentoPersonal[]>(`/personal/${personalId}/documentos`);
    return data;
  },

  updateEstado: async (
    id: number, 
    estado: EstadoDocumento, 
    notaRevision?: string
  ): Promise<DocumentoPersonal> => {
    const params = new URLSearchParams();
    params.append('estado', estado);
    if (notaRevision) params.append('notaRevision', notaRevision);

    const { data } = await axiosInstance.patch<DocumentoPersonal>(
      `/personal/documentos/${id}/estado?${params.toString()}`
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal/documentos/${id}`);
  },
};
