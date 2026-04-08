import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asignacionPersonalService } from '@/api/asignacionPersonalService';
import { CreateAsignacionPersonalDTO } from '@/models/logistica';
import { toast } from 'sonner';

const QUERY_KEY = 'asignaciones-personal';

export const useAsignacionesPersonal = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: asignacionPersonalService.getAll,
  });
};

export const useAsignacionesByEvento = (eventoId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, 'evento', eventoId],
    queryFn: () => asignacionPersonalService.getByEvento(eventoId),
    enabled: !!eventoId,
  });
};

export const useCreateAsignacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAsignacionPersonalDTO) => asignacionPersonalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Asignación creada exitosamente');
    },
    onError: () => {
      toast.error('Error al crear la asignación');
    },
  });
};

export const useAsignacionMasiva = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventoId, cantidad, excluirIds }: { eventoId: number; cantidad: number; excluirIds?: number[] }) =>
      asignacionPersonalService.asignacionMasiva(eventoId, cantidad, excluirIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(`${data.length} personal asignado al evento`);
    },
    onError: () => {
      toast.error('Error en la asignación masiva');
    },
  });
};

export const useDesactivarAsignacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asignacionPersonalService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Asignación desactivada');
    },
    onError: () => {
      toast.error('Error al desactivar la asignación');
    },
  });
};

export const useDeleteAsignacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => asignacionPersonalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Asignación eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar la asignación');
    },
  });
};
