import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemEventoService } from '@/api/itemEventoService';
import { poolTransversalService } from '@/api/poolTransversalService';
import { servicioPeriodoService } from '@/api/servicioPeriodoService';
import { CreateItemEventoDTO, CreatePoolTransversalDTO, CreateServicioPeriodoDTO, ItemEvento, PoolTransversal, ServicioPeriodo } from '@/models/presupuesto';
import { toast } from 'sonner';

// ========================
// HOOKS — ÍTEMS DE EVENTO
// ========================

export const useItemsEvento = () =>
  useQuery<ItemEvento[]>({
    queryKey: ['items-evento'],
    queryFn: itemEventoService.getAll,
  });

export const useItemsEventoByEvento = (eventoId: number) =>
  useQuery<ItemEvento[]>({
    queryKey: ['items-evento', 'evento', eventoId],
    queryFn: () => itemEventoService.getByEventoId(eventoId),
    enabled: !!eventoId,
  });

export const useCreateItemEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemEventoDTO) => itemEventoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items-evento'] });
      toast.success('Ítem de evento creado exitosamente');
    },
    onError: () => toast.error('Error al crear el ítem de evento'),
  });
};

export const useDeleteItemEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => itemEventoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items-evento'] });
      toast.success('Ítem eliminado');
    },
    onError: () => toast.error('Error al eliminar el ítem'),
  });
};

// ========================
// HOOKS — POOLS TRANSVERSALES
// ========================

export const usePools = () =>
  useQuery<PoolTransversal[]>({
    queryKey: ['pools'],
    queryFn: poolTransversalService.getAll,
  });

export const usePoolsByFestival = (festivalId: number) =>
  useQuery<PoolTransversal[]>({
    queryKey: ['pools', 'festival', festivalId],
    queryFn: () => poolTransversalService.getByFestivalId(festivalId),
    enabled: !!festivalId,
  });

export const useCreatePool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePoolTransversalDTO) => poolTransversalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      toast.success('Pool transversal creado exitosamente');
    },
    onError: () => toast.error('Error al crear el pool'),
  });
};

export const useDeletePool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => poolTransversalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      toast.success('Pool eliminado');
    },
    onError: () => toast.error('Error al eliminar el pool'),
  });
};

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
