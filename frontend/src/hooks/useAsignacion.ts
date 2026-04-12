import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asignacionService } from '@/api/asignacionService';
import { CreateAsignacionDTO } from '@/models/asignacion';
import { toast } from 'sonner';

export const useAsignacionesEvento = (eventoId: number) => {
  return useQuery({
    queryKey: ['asignaciones', 'evento', eventoId],
    queryFn: () => asignacionService.getByEvento(eventoId),
    enabled: !!eventoId,
  });
};

export const useAsignacionesPersonal = (personalId: number) => {
  return useQuery({
    queryKey: ['asignaciones', 'personal', personalId],
    queryFn: () => asignacionService.getByPersonal(personalId),
    enabled: !!personalId,
  });
};

export const useCreateAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAsignacionDTO) => asignacionService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Personal asignado correctamente al evento');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al asignar al evento. Verifique cupos o si ya está asignado.';
      toast.error(message);
    },
  });
};

export const useConfirmarAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => asignacionService.confirmarAsistencia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      toast.success('Asistencia confirmada exitosamente');
    },
    onError: () => {
      toast.error('Error al confirmar la asistencia');
    },
  });
};

export const useDesactivarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => asignacionService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
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
    mutationFn: (id: number) => asignacionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Asignación eliminada permanentemente');
    },
    onError: () => {
      toast.error('Error al eliminar la asignación');
    },
  });
};

export const useLiquidarEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventoId: number) => asignacionService.liquidarEvento(eventoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      queryClient.invalidateQueries({ queryKey: ['liquidacion'] });
      toast.success('Liquidación generada con éxito');
    },
    onError: () => {
      toast.error('Error al liquidar el evento');
    },
  });
};

/** Query hook to get liquidation data for an event */
export const useLiquidacionEvento = (eventoId: number) => {
  return useQuery({
    queryKey: ['liquidacion', eventoId],
    queryFn: () => asignacionService.obtenerLiquidacion(eventoId),
    enabled: !!eventoId,
  });
};
