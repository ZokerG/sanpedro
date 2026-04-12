import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personalService } from '@/api/personalService';
import { CreatePersonalDTO, TipoPersonal } from '@/models/personal';
import { toast } from 'sonner';

export const usePersonal = (tipo?: TipoPersonal) => {
  return useQuery({
    queryKey: ['personal', tipo],
    queryFn: () => personalService.getAll(tipo),
  });
};

export const usePersonalById = (id: number) => {
  return useQuery({
    queryKey: ['personal', id],
    queryFn: () => personalService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePersonal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonalDTO) => personalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
      toast.success('Personal creado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear personal';
      toast.error(message);
    },
  });
};

export const useUpdatePersonal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePersonalDTO }) => 
      personalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
      toast.success('Personal actualizado correctamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar personal';
      toast.error(message);
    },
  });
};

export const useDesactivarPersonal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => personalService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
      toast.success('Personal desactivado exitosamente');
    },
    onError: () => {
      toast.error('Error al desactivar el personal');
    },
  });
};

export const useDeletePersonal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => personalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
      toast.success('Personal eliminado permanentemente');
    },
    onError: () => {
      toast.error('Error al eliminar el personal. Es posible que tenga asignaciones activas.');
    },
  });
};
