import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trasladoService } from '@/api/trasladoService';
import { TrasladoPresupuestal, CreateTrasladoPresupuestalDTO } from '@/models/traslados';
import { toast } from 'sonner';

export const useTraslados = () =>
  useQuery<TrasladoPresupuestal[]>({
    queryKey: ['traslados'],
    queryFn: trasladoService.getAll,
  });

export const useTrasladosByFestival = (festivalId: number) =>
  useQuery<TrasladoPresupuestal[]>({
    queryKey: ['traslados', 'festival', festivalId],
    queryFn: () => trasladoService.getByFestivalId(festivalId),
    enabled: !!festivalId,
  });

export const useCreateTraslado = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTrasladoPresupuestalDTO) => trasladoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traslados'] });
      // Invalida también presupuesto por si cambia la vista financiera
      queryClient.invalidateQueries({ queryKey: ['items-evento'] });
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['servicios-periodo'] });
      toast.success('Traslado registrado exitosamente');
    },
    onError: () => toast.error('Error al registrar el traslado'),
  });
};

export const useDeleteTraslado = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => trasladoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traslados'] });
      toast.success('Traslado eliminado');
    },
    onError: () => toast.error('Error al eliminar el traslado'),
  });
};
