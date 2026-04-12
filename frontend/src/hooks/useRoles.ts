import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rol, CreateRolDTO, UpdateRolDTO } from '@/models/rol';
import { rolService } from '@/api/rolService';
import { toast } from 'sonner';

export function useRoles(activo?: boolean) {
  return useQuery<Rol[]>({
    queryKey: ['roles', activo],
    queryFn: () => rolService.getAll(activo),
  });
}

export function useRolById(id: number) {
  return useQuery<Rol>({
    queryKey: ['roles', id],
    queryFn: () => rolService.getById(id),
    enabled: !!id,
  });
}

export function useCreateRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRolDTO) => rolService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rol creado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear rol';
      toast.error(message);
    },
  });
}

export function useUpdateRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRolDTO }) => rolService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar rol';
      toast.error(message);
    },
  });
}

export function useDeleteRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rolService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rol eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar rol';
      toast.error(message);
    },
  });
}

export function useToggleRolActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rolService.toggleActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar estado del rol';
      toast.error(message);
    },
  });
}
