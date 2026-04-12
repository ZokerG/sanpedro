import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { solicitudService } from '@/api/solicitudService';
import { CrearSolicitudDTO } from '@/models/solicitudParticipacion';
import { toast } from 'sonner';

export const useMisSolicitudes = (personalId: number) => {
  return useQuery({
    queryKey: ['solicitudes', 'personal', personalId],
    queryFn: () => solicitudService.getMisSolicitudes(personalId),
    enabled: !!personalId,
  });
};

export const useSolicitudesEvento = (eventoId: number) => {
  return useQuery({
    queryKey: ['solicitudes', 'evento', eventoId],
    queryFn: () => solicitudService.getPorEvento(eventoId),
    enabled: !!eventoId,
  });
};

export const useSolicitudesPendientesEvento = (eventoId: number) => {
  return useQuery({
    queryKey: ['solicitudes', 'evento', eventoId, 'pendientes'],
    queryFn: () => solicitudService.getPendientes(eventoId),
    enabled: !!eventoId,
  });
};

export const useCrearSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ personalId, data }: { personalId: number; data: CrearSolicitudDTO }) =>
      solicitudService.crear(personalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success('Solicitud enviada correctamente');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al enviar solicitud';
      toast.error(msg);
    },
  });
};

export const useAprobarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (solicitudId: number) => solicitudService.aprobar(solicitudId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      toast.success('Solicitud aprobada — personal asignado al evento');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al aprobar solicitud';
      toast.error(msg);
    },
  });
};

export const useRechazarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ solicitudId, nota }: { solicitudId: number; nota?: string }) =>
      solicitudService.rechazar(solicitudId, nota),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success('Solicitud rechazada');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al rechazar solicitud';
      toast.error(msg);
    },
  });
};

export const useCancelarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (solicitudId: number) => solicitudService.cancelar(solicitudId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      toast.success('Solicitud cancelada');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al cancelar solicitud';
      toast.error(msg);
    },
  });
};
