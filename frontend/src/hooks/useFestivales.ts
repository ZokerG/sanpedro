import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { festivalService } from '@/api/festivalService';
import { Festival, CreateFestivalDTO } from '@/models/festival';
import { toast } from 'sonner';

// Hook para consultar festivales
export const useFestivales = () => {
  return useQuery<Festival[]>({
    queryKey: ['festivales'],
    queryFn: festivalService.getAll,
  });
};

// Hook para crear un festival
export const useCreateFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFestivalDTO) => festivalService.create(data),
    onSuccess: () => {
      // Invalida la query para forzar el refetch de lista automatically
      queryClient.invalidateQueries({ queryKey: ['festivales'] });
      toast.success('Festival creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el festival');
      console.error(error);
    },
  });
};

// Hook para actualizar
export const useUpdateFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateFestivalDTO }) =>
      festivalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festivales'] });
      toast.success('Festival actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el festival');
    },
  });
};

// Hook para eliminar
export const useDeleteFestival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => festivalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['festivales'] });
      toast.success('Festival eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el festival');
    },
  });
};
