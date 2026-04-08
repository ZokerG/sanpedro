import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tareaPadreService } from '@/api/tareaPadreService';
import { subTareaService } from '@/api/subTareaService';
import { TareaPadre, SubTarea, CreateTareaPadreDTO, CreateSubTareaDTO } from '@/models/tareas';
import { toast } from 'sonner';

// ─── TareaPadre ───────────────────────────────────────────────────────────────
export const useTareasPadre = () =>
  useQuery<TareaPadre[]>({
    queryKey: ['tareas-padre'],
    queryFn: tareaPadreService.getAll,
  });

export const useTareasPadreByEvento = (eventoId: number) =>
  useQuery<TareaPadre[]>({
    queryKey: ['tareas-padre', 'evento', eventoId],
    queryFn: () => tareaPadreService.getByEventoId(eventoId),
    enabled: !!eventoId,
  });

export const useCreateTareaPadre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTareaPadreDTO) => tareaPadreService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas-padre'] });
      toast.success('Tarea creada exitosamente');
    },
    onError: () => toast.error('Error al crear la tarea'),
  });
};

export const useDeleteTareaPadre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tareaPadreService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas-padre'] });
      queryClient.invalidateQueries({ queryKey: ['subtareas'] });
      toast.success('Tarea eliminada');
    },
    onError: () => toast.error('Error al eliminar la tarea'),
  });
};

// ─── SubTarea ─────────────────────────────────────────────────────────────────
export const useSubTareas = () =>
  useQuery<SubTarea[]>({
    queryKey: ['subtareas'],
    queryFn: subTareaService.getAll,
  });

export const useSubTareasByTareaPadre = (tareaPadreId: number) =>
  useQuery<SubTarea[]>({
    queryKey: ['subtareas', 'tarea-padre', tareaPadreId],
    queryFn: () => subTareaService.getByTareaPadreId(tareaPadreId),
    enabled: !!tareaPadreId,
  });

export const useCreateSubTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubTareaDTO) => subTareaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtareas'] });
      toast.success('Subtarea creada exitosamente');
    },
    onError: () => toast.error('Error al crear la subtarea'),
  });
};

export const useDeleteSubTarea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subTareaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtareas'] });
      toast.success('Subtarea eliminada');
    },
    onError: () => toast.error('Error al eliminar la subtarea'),
  });
};
