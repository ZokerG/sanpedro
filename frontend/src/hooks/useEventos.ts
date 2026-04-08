import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventoService } from '@/api/eventoService';
import { Evento, CreateEventoDTO } from '@/models/evento';
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
