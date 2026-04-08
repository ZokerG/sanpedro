import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personalLogisticoService } from '@/api/personalLogisticoService';
import { CreatePersonalLogisticoDTO } from '@/models/personalLogistico';
import { toast } from 'sonner';

const QUERY_KEY = 'personal-logistico';

export const usePersonalLogistico = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: personalLogisticoService.getAll,
  });
};

export const useCreatePersonalLogistico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePersonalLogisticoDTO) => personalLogisticoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Personal registrado exitosamente');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Error al registrar el personal';
      toast.error(msg);
    },
  });
};

export const useDesactivarPersonalLogistico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => personalLogisticoService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Personal desactivado');
    },
    onError: () => {
      toast.error('Error al desactivar el personal');
    },
  });
};

export const useDeletePersonalLogistico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => personalLogisticoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Personal eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el personal');
    },
  });
};
