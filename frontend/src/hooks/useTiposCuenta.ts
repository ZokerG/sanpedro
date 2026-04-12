import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TipoCuentaBancaria, CreateTipoCuentaDTO, UpdateTipoCuentaDTO } from '@/models/tipoCuentaBancaria';
import { tipoCuentaService } from '@/api/tipoCuentaService';
import { toast } from 'sonner';

export function useTiposCuenta(activo?: boolean) {
  return useQuery<TipoCuentaBancaria[]>({
    queryKey: ['tiposCuenta', activo],
    queryFn: () => tipoCuentaService.getAll(activo),
  });
}

export function useCreateTipoCuenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTipoCuentaDTO) => tipoCuentaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposCuenta'] });
      toast.success('Tipo de cuenta creado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al crear tipo de cuenta';
      toast.error(message);
    },
  });
}

export function useUpdateTipoCuenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTipoCuentaDTO }) => tipoCuentaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposCuenta'] });
      toast.success('Tipo de cuenta actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar tipo de cuenta';
      toast.error(message);
    },
  });
}

export function useDeleteTipoCuenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tipoCuentaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposCuenta'] });
      toast.success('Tipo de cuenta eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al eliminar tipo de cuenta';
      toast.error(message);
    },
  });
}

export function useToggleTipoCuentaActivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tipoCuentaService.toggleActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiposCuenta'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al cambiar estado';
      toast.error(message);
    },
  });
}
