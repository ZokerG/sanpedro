'use client';

import { useState } from 'react';
import {
  DollarSign, Plus, Trash2, Clock, AlertCircle, X,
} from 'lucide-react';
import {
  useServiciosPeriodo, useCreateServicioPeriodo, useDeleteServicioPeriodo,
} from '@/hooks/usePresupuesto';
import { useFestivales } from '@/hooks/useFestivales';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  CreateServicioPeriodoDTO, ServicioPeriodo,
} from '@/models/presupuesto';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val: number | undefined | null) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0);

const pct = (consumed: number, total: number) =>
  total > 0 ? Math.round((consumed / total) * 100) : 0;

function ProgressBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div className={cn('h-1.5 rounded-full transition-all', color)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PresupuestoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Servicios por Período
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los servicios transversales o financieros del festival por período.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </button>
      </div>

      {/* Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <ServiciosTab />
      </div>

      {/* Modals */}
      {modalOpen && <CreateServicioModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// ─── Tab: Servicios por Período ────────────────────────────────────────────────
function ServiciosTab() {
  const { data: servicios, isLoading, isError } = useServiciosPeriodo();
  const deleteMutation = useDeleteServicioPeriodo();

  return (
    <TableShell
      isLoading={isLoading}
      isError={isError}
      isEmpty={!servicios || servicios.length === 0}
      emptyMessage="No hay servicios por período registrados"
      emptyIcon={Clock}
      columns={['ID', 'Nombre', 'Festival', 'Fecha Inicio', 'Fecha Fin', 'V. Total', 'V. Ejecutado', 'Descripción', '']}
    >
      {(servicios ?? []).map((sv: ServicioPeriodo) => {
        const execPct = pct(Number(sv.valorEjecutado), Number(sv.valorTotal));
        return (
          <tr key={sv.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-4 font-medium text-slate-900">#{sv.id}</td>
            <td className="px-5 py-4 font-semibold text-slate-800">{sv.nombre}</td>
            <td className="px-5 py-4 text-slate-500">#{sv.festivalId}</td>
            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{sv.fechaInicio}</td>
            <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{sv.fechaFin}</td>
            <td className="px-5 py-4 font-semibold text-slate-900">{fmt(Number(sv.valorTotal))}</td>
            <td className="px-5 py-4 min-w-[130px]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{fmt(Number(sv.valorEjecutado))}</span>
                  <span>{execPct}%</span>
                </div>
                <ProgressBar value={execPct} />
              </div>
            </td>
            <td className="px-5 py-4 text-slate-500 max-w-[160px] truncate">{sv.descripcion ?? '—'}</td>
            <td className="px-5 py-4 text-right">
              <button
                onClick={() => { if (confirm('¿Eliminar este servicio?')) deleteMutation.mutate(sv.id); }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        );
      })}
    </TableShell>
  );
}

// ─── Shared Components ─────────────────────────────────────────────────────────

type TableShellProps = {
  isLoading: boolean; isError: boolean; isEmpty: boolean;
  emptyMessage: string; emptyIcon: React.ElementType;
  columns: string[]; children: React.ReactNode;
};

function TableShell({ isLoading, isError, isEmpty, emptyMessage, emptyIcon: Icon, columns, children }: TableShellProps) {
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">{[...Array(5)].map((_, j) => <div key={j} className="h-4 bg-slate-200 rounded animate-pulse flex-1" />)}</div>
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-12 text-center text-red-600 flex flex-col items-center gap-2">
        <AlertCircle className="w-8 h-8" />
        <p>Error al cargar los datos. Verifica que el servidor esté activo.</p>
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="p-16 text-center flex flex-col items-center text-slate-500">
        <Icon className="w-12 h-12 mb-4 text-slate-300" />
        <p className="font-medium text-slate-700">{emptyMessage}</p>
        <p className="text-sm mt-1">Usa el botón &quot;Nuevo&quot; para agregar el primero.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>{columns.map(col => <th key={col} scope="col" className="px-5 py-3.5 font-medium whitespace-nowrap">{col}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

// ─── Shared UI primitives ──────────────────────────────────────────────────────
const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white';

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>;
}

function ModalFooter({ onClose, isPending }: { onClose: () => void; isPending: boolean }) {
  return (
    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Cancelar</button>
      <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50">
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Modal: Crear Servicio por Período ─────────────────────────────────────────
function CreateServicioModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateServicioPeriodo();
  const { data: festivales } = useFestivales();

  const INIT: CreateServicioPeriodoDTO = { festivalId: 0, resolucionId: 0, nombre: '', fechaInicio: '', fechaFin: '', valorTotal: 0, valorEjecutado: 0, descripcion: '' };
  const [form, setForm] = useState(INIT);

  const numFields = ['festivalId', 'resolucionId', 'valorTotal', 'valorEjecutado'];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: numFields.includes(name) ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.festivalId || !form.resolucionId || !form.nombre || !form.fechaInicio || !form.fechaFin || !form.valorTotal) {
      toast.error('Completa todos los campos obligatorios'); return;
    }
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <ModalShell title="Nuevo Servicio por Período" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Festival</Label>
            <select name="festivalId" required className={selectClass} value={form.festivalId} onChange={handleChange}>
              <option value={0}>Selecciona un festival</option>
              {(festivales ?? []).map(f => <option key={f.id} value={f.id}>{f.nombre} ({f.anio})</option>)}
            </select>
          </div>
          <div>
            <Label>ID de Resolución</Label>
            <input name="resolucionId" type="number" required min={1} className={inputClass} placeholder="Ej: 1" value={form.resolucionId || ''} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Nombre del Servicio</Label>
            <input name="nombre" type="text" required className={inputClass} placeholder="Ej: Seguridad privada" value={form.nombre} onChange={handleChange} />
          </div>
          <div>
            <Label>Fecha de Inicio</Label>
            <input name="fechaInicio" type="date" required className={inputClass} value={form.fechaInicio} onChange={handleChange} />
          </div>
          <div>
            <Label>Fecha de Fin</Label>
            <input name="fechaFin" type="date" required className={inputClass} value={form.fechaFin} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Total ($)</Label>
            <input name="valorTotal" type="number" required min={0} step="0.01" className={inputClass} value={form.valorTotal || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Ejecutado ($)</Label>
            <input name="valorEjecutado" type="number" min={0} step="0.01" className={inputClass} value={form.valorEjecutado || ''} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Descripción (opcional)</Label>
            <textarea name="descripcion" rows={3} className={cn(inputClass, 'resize-none')} placeholder="Describe el servicio..." value={form.descripcion} onChange={handleChange} />
          </div>
        </div>
        <ModalFooter onClose={onClose} isPending={createMutation.isPending} />
      </form>
    </ModalShell>
  );
}
