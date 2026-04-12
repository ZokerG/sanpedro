import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoService } from '@/api/documentoService';
import { TipoDocumentoRequerido, EstadoDocumento } from '@/models/documento';
import { toast } from 'sonner';

export const useDocumentosPersonal = (personalId: number) => {
  return useQuery({
    queryKey: ['documentos', personalId],
    queryFn: () => documentoService.getByPersonal(personalId),
    enabled: !!personalId,
  });
};

export const useUploadDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      personalId, 
      tipo, 
      file 
    }: { 
      personalId: number; 
      tipo: TipoDocumentoRequerido; 
      file: File 
    }) => documentoService.upload(personalId, tipo, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentos', variables.personalId] });
      toast.success('Documento subido correctamente');
    },
    onError: (error: any) => {
      toast.error('Error al subir el documento: ' + (error.response?.data?.message || 'Error desconocido'));
    },
  });
};

export const useUpdateEstadoDocumento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      estado, 
      notaRevision, 
      personalId 
    }: { 
      id: number; 
      estado: EstadoDocumento; 
      notaRevision?: string; 
      personalId: number 
    }) => documentoService.updateEstado(id, estado, notaRevision),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentos', variables.personalId] });
      toast.success('Estado del documento actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar el estado del documento');
    },
  });
};

export const useDeleteDocumento = (personalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => documentoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos', personalId] });
      toast.success('Documento eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el documento');
    },
  });
};
