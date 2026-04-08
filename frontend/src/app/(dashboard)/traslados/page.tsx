'use client';

import { useState } from 'react';
import {
  ArrowLeftRight, Plus, Trash2, AlertCircle, X,
  CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { useTraslados, useCreateTraslado, useDeleteTraslado } from '@/hooks/useTraslados';
import { useFestivales } from '@/hooks/useFestivales';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  TrasladoPresupuestal, CreateTrasladoPresupuestalDTO,
  TipoTrasladoItem, EstadoTraslado,
} from '@/models/traslados';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0);

const ESTADO_CONFIG: Record<EstadoTraslado, { label: string; icon: React.ReactNode; style: string }> = {
  PENDIENTE_RESOLUCION: {
    label: 'Pendiente',
    icon: <Clock className="w-3.5 h-3.5" />,
    style: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  APROBADO_CON_RESOLUCION: {
    label: 'Aprobado',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  RECHAZADO: {
    label: 'Rechazado',
    icon: <XCircle className="w-3.5 h-3.5" />,
    style: 'bg-red-50 text-red-700 border-red-200',
  },
};

const TIPO_LABEL: Record<TipoTrasladoItem, string> = {
  ITEM_EVENTO: 'Ítem Evento',
  POOL: 'Pool Transversal',
  SERVICIO: 'Servicio Período',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TrasladosPage() {
  const { data: traslados, isLoading, isError } = useTraslados();
  const deleteMutation = useDeleteTraslado();
  const [modalOpen, setModalOpen] = useState(false);

  const total = traslados?.length ?? 0;
  const aprobados = traslados?.filter(t => t.estado === 'APROBADO_CON_RESOLUCION').length ?? 0;
  const pendientes = traslados?.filter(t => t.estado === 'PENDIENTE_RESOLUCION').length ?? 0;
  const totalMonto = traslados?.reduce((acc, t) => acc + Number(t.valor), 0) ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-[var(--color-primary)]" />
            Traslados Presupuestales
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro de movimientos presupuestales entre ítems, pools y servicios del festival.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Traslado
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total traslados', value: total, color: 'text-slate-800' },
          { label: 'Aprobados', value: aprobados, color: 'text-emerald-600' },
          { label: 'Pendientes', value: pendientes, color: 'text-amber-600' },
          { label: 'Monto total', value: fmt(totalMonto), color: 'text-[var(--color-primary)]' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">Historial de Traslados</h2>
        </div>

        {isLoading && (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
                ))}
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="p-12 text-center text-red-600 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>Error al cargar los traslados. Verifica que el servidor esté activo.</p>
          </div>
        )}

        {!isLoading && !isError && (!traslados || traslados.length === 0) && (
          <div className="p-16 text-center flex flex-col items-center text-slate-500">
            <ArrowLeftRight className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-medium text-slate-700">No hay traslados registrados</p>
            <p className="text-sm mt-1">Usa &quot;Nuevo Traslado&quot; para registrar el primero.</p>
          </div>
        )}

        {!isLoading && !isError && traslados && traslados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  {['ID', 'Festival', 'Origen → Destino', 'Valor', 'Justificación', 'Estado', ''].map(col => (
                    <th key={col} className="px-5 py-3.5 font-medium whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {traslados.map((t: TrasladoPresupuestal) => {
                  const estado = ESTADO_CONFIG[t.estado];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900">#{t.id}</td>
                      <td className="px-5 py-4 text-slate-500">#{t.festivalId}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                            {TIPO_LABEL[t.tipoOrigen]} #{t.idOrigen}
                          </span>
                          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                            {TIPO_LABEL[t.tipoDestino]} #{t.idDestino}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">{fmt(Number(t.valor))}</td>
                      <td className="px-5 py-4 max-w-[220px]">
                        <p className="text-slate-600 truncate" title={t.justificacion}>{t.justificacion}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                          estado.style
                        )}>
                          {estado.icon}
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => { if (confirm('¿Eliminar este traslado?')) deleteMutation.mutate(t.id); }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && <CreateTrasladoModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';
const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>;
}

function CreateTrasladoModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateTraslado();
  const { data: festivales } = useFestivales();

  const INIT: CreateTrasladoPresupuestalDTO = {
    festivalId: 0,
    resolucionRespaldoId: null,
    tipoOrigen: 'ITEM_EVENTO',
    idOrigen: 0,
    tipoDestino: 'ITEM_EVENTO',
    idDestino: 0,
    valor: 0,
    justificacion: '',
    aprobadoPorId: null,
    estado: 'PENDIENTE_RESOLUCION',
  };
  const [form, setForm] = useState(INIT);

  const numFields = ['festivalId', 'resolucionRespaldoId', 'idOrigen', 'idDestino', 'valor', 'aprobadoPorId'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: numFields.includes(name) ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.festivalId || !form.idOrigen || !form.idDestino || !form.valor || !form.justificacion) {
      toast.error('Completa todos los campos obligatorios'); return;
    }
    if (form.tipoOrigen === form.tipoDestino && form.idOrigen === form.idDestino) {
      toast.error('El origen y destino no pueden ser el mismo ítem'); return;
    }
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-800">Nuevo Traslado Presupuestal</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Festival */}
            <div className="md:col-span-2">
              <Label>Festival *</Label>
              <select name="festivalId" required className={selectClass} value={form.festivalId} onChange={handleChange}>
                <option value={0}>Selecciona un festival</option>
                {(festivales ?? []).map(f => (
                  <option key={f.id} value={f.id}>{f.nombre} ({f.anio})</option>
                ))}
              </select>
            </div>

            {/* Separador visual: origen */}
            <div className="md:col-span-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100" />
                Origen
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo de origen *</Label>
                  <select name="tipoOrigen" className={selectClass} value={form.tipoOrigen} onChange={handleChange}>
                    <option value="ITEM_EVENTO">Ítem Evento</option>
                    <option value="POOL">Pool Transversal</option>
                    <option value="SERVICIO">Servicio Período</option>
                  </select>
                </div>
                <div>
                  <Label>ID de origen *</Label>
                  <input name="idOrigen" type="number" required min={1} className={inputClass} placeholder="Ej: 1" value={form.idOrigen || ''} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Separador visual: destino */}
            <div className="md:col-span-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100" />
                Destino
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo de destino *</Label>
                  <select name="tipoDestino" className={selectClass} value={form.tipoDestino} onChange={handleChange}>
                    <option value="ITEM_EVENTO">Ítem Evento</option>
                    <option value="POOL">Pool Transversal</option>
                    <option value="SERVICIO">Servicio Período</option>
                  </select>
                </div>
                <div>
                  <Label>ID de destino *</Label>
                  <input name="idDestino" type="number" required min={1} className={inputClass} placeholder="Ej: 2" value={form.idDestino || ''} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Monto y estado */}
            <div>
              <Label>Valor a trasladar ($) *</Label>
              <input name="valor" type="number" required min={1} step="0.01" className={inputClass} placeholder="Ej: 5000000" value={form.valor || ''} onChange={handleChange} />
            </div>

            <div>
              <Label>Estado *</Label>
              <select name="estado" className={selectClass} value={form.estado} onChange={handleChange}>
                <option value="PENDIENTE_RESOLUCION">⏳ Pendiente resolución</option>
                <option value="APROBADO_CON_RESOLUCION">✅ Aprobado con resolución</option>
                <option value="RECHAZADO">❌ Rechazado</option>
              </select>
            </div>

            {/* ID Resolución respaldo (opcional) */}
            <div>
              <Label>ID Resolución de respaldo (opcional)</Label>
              <input name="resolucionRespaldoId" type="number" min={1} className={inputClass} placeholder="Ej: 3" value={form.resolucionRespaldoId ?? ''} onChange={handleChange} />
            </div>

            {/* Justificación */}
            <div className="md:col-span-2">
              <Label>Justificación *</Label>
              <textarea
                name="justificacion"
                required
                rows={3}
                className={cn(inputClass, 'resize-none')}
                placeholder="Describe el motivo del traslado presupuestal..."
                value={form.justificacion}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Registrando...' : 'Registrar Traslado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
