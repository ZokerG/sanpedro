import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banco, CreateBancoDTO, UpdateBancoDTO } from '@/models/banco';
import { bancoService } from '@/api/bancoService';
import { toast } from 'sonner';

export function useBancos(activo?: boolean) {
  return useQuery<Banco[]>({
    queryKey: ['bancos', activo],
    queryFn: () => bancoService.getAll(activo),
  });
}

export function useCreateBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBancoDTO) => bancoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
      toast.success('Banco creado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear banco';
      toast.error(message);
    },
  });
}

export function useUpdateBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBancoDTO }) => bancoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
      toast.success('Banco actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar banco';
      toast.error(message);
    },
  });
}

export function useDeleteBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bancoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
      toast.success('Banco eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar banco';
      toast.error(message);
    },
  });
}

export function useToggleBancoActivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bancoService.toggleActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bancos'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar estado del banco';
      toast.error(message);
    },
  });
}
