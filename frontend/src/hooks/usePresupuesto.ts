import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicioPeriodoService } from '@/api/servicioPeriodoService';
import { CreateServicioPeriodoDTO, ServicioPeriodo } from '@/models/presupuesto';
import { toast } from 'sonner';

// ========================
// HOOKS — SERVICIOS POR PERÍODO
// ========================

export const useServiciosPeriodo = () =>
  useQuery<ServicioPeriodo[]>({
    queryKey: ['servicios-periodo'],
    queryFn: servicioPeriodoService.getAll,
  });

export const useServiciosPeriodoByFestival = (festivalId: number) =>
  useQuery<ServicioPeriodo[]>({
    queryKey: ['servicios-periodo', 'festival', festivalId],
    queryFn: () => servicioPeriodoService.getByFestivalId(festivalId),
    enabled: !!festivalId,
  });

export const useCreateServicioPeriodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServicioPeriodoDTO) => servicioPeriodoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios-periodo'] });
      toast.success('Servicio por período creado exitosamente');
    },
    onError: () => toast.error('Error al crear el servicio'),
  });
};

export const useDeleteServicioPeriodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => servicioPeriodoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios-periodo'] });
      toast.success('Servicio eliminado');
    },
    onError: () => toast.error('Error al eliminar el servicio'),
  });
};
