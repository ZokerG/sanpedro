'use client';

import { useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { useEventos, useCreateEvento, useDeleteEvento } from '@/hooks/useEventos';
import { useFestivales } from '@/hooks/useFestivales';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventosPage() {
  const { data: eventos, isLoading, isError } = useEventos();
  const deleteMutation = useDeleteEvento();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[var(--color-primary)]" />
            Gestión de Eventos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los eventos, fechas y lugares asociados a los festivales.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                 <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">Error cargando eventos.</div>
        ) : (!eventos || eventos.length === 0) ? (
          <div className="p-16 text-center text-slate-500">No hay eventos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">Lugar</th>
                  <th className="px-6 py-4 font-medium">Fecha Inicio</th>
                  <th className="px-6 py-4 font-medium">Requiere Boleta</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eventos.map((evento) => (
                  <tr key={evento.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{evento.nombre}</td>
                    <td className="px-6 py-4">{evento.lugar || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {evento.fechaEvento ? format(new Date(evento.fechaEvento), "d 'de' MMMM yyyy, HH:mm", { locale: es }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {evento.requiereBoleta ? (
                         <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium border border-amber-200">Sí</span>
                      ) : (
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteMutation.mutate(evento.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateEventoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

// Modal simplificado
const INITIAL_FORM_STATE = {
  nombre: '',
  descripcion: '',
  festivalId: '',
  sectorId: '1', 
  fechaInicio: '',
  fechaFin: '',
  estado: 'PLANEADO' as const,
  prioridad: 'MEDIA' as const,
  lugar: '',
  requiereBoleta: false
};

function CreateEventoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreateEvento();
  const { data: festivales } = useFestivales();
  // TODO: Agregar Sectores si se requiren, por ahora asumo mock sectorId = 1
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.festivalId || !formData.fechaInicio) {
      toast.error('Complete los campos obligatorios');
      return;
    }
    const { fechaInicio: inputFecha, ...rest } = formData;
    
    createMutation.mutate(
      { 
        ...rest,
        fechaInicio: inputFecha,
        fechaEvento: inputFecha,
        festivalId: Number(formData.festivalId),
        sectorId: Number(formData.sectorId)
      },
      {
        onSuccess: () => {
          setFormData(INITIAL_FORM_STATE);
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Crear Nuevo Evento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Evento</label>
            <input 
              type="text" required
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción (Opcional)</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-md h-20 resize-none"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Festival</label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={formData.festivalId}
              onChange={(e) => setFormData({...formData, festivalId: e.target.value})}
            >
              <option value="">Seleccione un festival...</option>
              {festivales?.map(f => (
                <option key={f.id} value={f.id}>{f.nombre} ({f.anio})</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value as any})}
              >
                <option value="PLANEADO">Planeado</option>
                <option value="EN_PREPARACION">En Preparación</option>
                <option value="EN_CURSO">En Curso</option>
                <option value="EJECUTADO">Ejecutado</option>
                <option value="LIQUIDADO">Liquidado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                value={formData.prioridad}
                onChange={(e) => setFormData({...formData, prioridad: e.target.value as any})}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input
                type="datetime-local" required
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Fin</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.fechaFin}
                onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lugar (Opcional)</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              value={formData.lugar}
              onChange={(e) => setFormData({...formData, lugar: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="requiereBoleta"
              checked={formData.requiereBoleta}
              onChange={(e) => setFormData({...formData, requiereBoleta: e.target.checked})}
              className="w-4 h-4 text-[var(--color-primary)] border-slate-300 rounded focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="requiereBoleta" className="text-sm font-medium text-slate-700">
              Requiere Boleta
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md">
              {createMutation.isPending ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
