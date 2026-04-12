import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventoService } from '@/api/eventoService';
import { asignacionService } from '@/api/asignacionService';
import { Evento, CreateEventoDTO } from '@/models/evento';
import { LiquidacionEvento } from '@/models/asignacion';
import { toast } from 'sonner';

export const useEventos = () => {
  return useQuery<Evento[]>({
    queryKey: ['eventos'],
    queryFn: eventoService.getAll,
  });
};

export const useEventosByFestival = (festivalId: number) => {
  return useQuery<Evento[]>({
    queryKey: ['eventos', 'festival', festivalId],
    queryFn: () => eventoService.getByFestivalId(festivalId),
    enabled: !!festivalId,
  });
};

export const useCreateEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventoDTO) => eventoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Evento creado exitosamente');
    },
    onError: () => {
      toast.error('Error al crear el evento');
    },
  });
};

export const useDeleteEvento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
      toast.success('Evento eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el evento');
    },
  });
};

/** Query hook to get liquidation data for multiple events */
export const useLiquidaciones = (eventoIds: number[]) => {
  return useQuery<LiquidacionEvento[]>({
    queryKey: ['liquidaciones', eventoIds],
    queryFn: async () => {
      const results = await Promise.all(
        eventoIds.map((id) => asignacionService.obtenerLiquidacion(id))
      );
      return results;
    },
    enabled: eventoIds.length > 0,
  });
};
