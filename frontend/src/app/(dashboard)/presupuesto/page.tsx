'use client';

import { useState } from 'react';
import {
  DollarSign, Plus, Trash2, LayoutList, Layers, Clock, AlertCircle, X,
} from 'lucide-react';
import {
  useItemsEvento, useCreateItemEvento, useDeleteItemEvento,
  usePools, useCreatePool, useDeletePool,
  useServiciosPeriodo, useCreateServicioPeriodo, useDeleteServicioPeriodo,
} from '@/hooks/usePresupuesto';
import { useFestivales } from '@/hooks/useFestivales';
import { useEventos } from '@/hooks/useEventos';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  CreateItemEventoDTO, CreatePoolTransversalDTO, CreateServicioPeriodoDTO,
  ItemEvento, PoolTransversal, ServicioPeriodo,
} from '@/models/presupuesto';

type ActiveTab = 'items' | 'pools' | 'servicios';

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('items');
  const [modalOpen, setModalOpen] = useState(false);

  const tabs = [
    { id: 'items' as ActiveTab, label: 'Ítems de Evento', icon: LayoutList },
    { id: 'pools' as ActiveTab, label: 'Pools Transversales', icon: Layers },
    { id: 'servicios' as ActiveTab, label: 'Servicios por Período', icon: Clock },
  ];

  const newLabel = {
    items: 'Nuevo Ítem',
    pools: 'Nuevo Pool',
    servicios: 'Nuevo Servicio',
  }[activeTab];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[var(--color-primary)]" />
            Gestión de Presupuesto
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra ítems financieros, pools transversales y servicios del festival.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {newLabel}
        </button>
      </div>

      {/* Tabs Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex -mb-px">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all',
                  activeTab === id
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'items' && <ItemsTab />}
        {activeTab === 'pools' && <PoolsTab />}
        {activeTab === 'servicios' && <ServiciosTab />}
      </div>

      {/* Modals */}
      {modalOpen && activeTab === 'items' && <CreateItemModal onClose={() => setModalOpen(false)} />}
      {modalOpen && activeTab === 'pools' && <CreatePoolModal onClose={() => setModalOpen(false)} />}
      {modalOpen && activeTab === 'servicios' && <CreateServicioModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// ─── Tab: Ítems de Evento ──────────────────────────────────────────────────────
function ItemsTab() {
  const { data: items, isLoading, isError } = useItemsEvento();
  const deleteMutation = useDeleteItemEvento();

  return (
    <TableShell
      isLoading={isLoading}
      isError={isError}
      isEmpty={!items || items.length === 0}
      emptyMessage="No hay ítems de evento registrados"
      emptyIcon={LayoutList}
      columns={['ID', 'Detalle', 'Evento', 'Unidad', 'Cantidad', 'V. Unitario', 'V. Total', 'Ejecutado', 'Estado', '']}
    >
      {(items ?? []).map((item: ItemEvento) => {
        const execPct = pct(Number(item.valorEjecutado), Number(item.valorTotal));
        return (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-4 font-medium text-slate-900">#{item.id}</td>
            <td className="px-5 py-4 max-w-[200px]">
              <p className="font-medium text-slate-800 truncate">{item.detalle}</p>
            </td>
            <td className="px-5 py-4 text-slate-500">#{item.eventoId}</td>
            <td className="px-5 py-4 text-slate-600">{item.unidad}</td>
            <td className="px-5 py-4 text-slate-700">{Number(item.cantidad).toLocaleString('es-CO')}</td>
            <td className="px-5 py-4 text-slate-700">{fmt(Number(item.valorUnitario))}</td>
            <td className="px-5 py-4 font-semibold text-slate-900">{fmt(Number(item.valorTotal))}</td>
            <td className="px-5 py-4 min-w-[130px]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{fmt(Number(item.valorEjecutado))}</span>
                  <span>{execPct}%</span>
                </div>
                <ProgressBar value={execPct} />
              </div>
            </td>
            <td className="px-5 py-4"><StatusBadge estado={item.estado} /></td>
            <td className="px-5 py-4 text-right">
              <button
                onClick={() => { if (confirm('¿Eliminar este ítem?')) deleteMutation.mutate(item.id); }}
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

// ─── Tab: Pools Transversales ──────────────────────────────────────────────────
function PoolsTab() {
  const { data: pools, isLoading, isError } = usePools();
  const deleteMutation = useDeletePool();

  return (
    <TableShell
      isLoading={isLoading}
      isError={isError}
      isEmpty={!pools || pools.length === 0}
      emptyMessage="No hay pools transversales registrados"
      emptyIcon={Layers}
      columns={['ID', 'Nombre', 'Festival', 'Unidad', 'Cant. (consumida/total)', 'V. Total', 'V. (consumido/total)', 'Estado', '']}
    >
      {(pools ?? []).map((pool: PoolTransversal) => {
        const cantPct = pct(Number(pool.cantidadConsumida), Number(pool.cantidadTotal));
        const valPct = pct(Number(pool.valorConsumido), Number(pool.valorTotal));
        return (
          <tr key={pool.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-5 py-4 font-medium text-slate-900">#{pool.id}</td>
            <td className="px-5 py-4 font-semibold text-slate-800">{pool.nombre}</td>
            <td className="px-5 py-4 text-slate-500">#{pool.festivalId}</td>
            <td className="px-5 py-4 text-slate-600">{pool.unidad}</td>
            <td className="px-5 py-4 min-w-[150px]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{Number(pool.cantidadConsumida).toLocaleString()} / {Number(pool.cantidadTotal).toLocaleString()}</span>
                  <span>{cantPct}%</span>
                </div>
                <ProgressBar value={cantPct} />
              </div>
            </td>
            <td className="px-5 py-4 font-semibold text-slate-900">{fmt(Number(pool.valorTotal))}</td>
            <td className="px-5 py-4 min-w-[150px]">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{fmt(Number(pool.valorConsumido))}</span>
                  <span>{valPct}%</span>
                </div>
                <ProgressBar value={valPct} />
              </div>
            </td>
            <td className="px-5 py-4"><StatusBadge estado={pool.estado} /></td>
            <td className="px-5 py-4 text-right">
              <button
                onClick={() => { if (confirm('¿Eliminar este pool?')) deleteMutation.mutate(pool.id); }}
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
function StatusBadge({ estado }: { estado?: string }) {
  const styles: Record<string, string> = {
    ACTIVO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVO: 'bg-slate-50 text-slate-600 border-slate-200',
    DISPONIBLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    EN_USO: 'bg-blue-50 text-blue-700 border-blue-200',
    AGOTADO: 'bg-red-50 text-red-700 border-red-200',
  };
  const label = estado ?? 'N/A';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', styles[label] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
      {label}
    </span>
  );
}

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
const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';
const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white';

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>;
}

function ModalFooter({ onClose, isPending }: { onClose: () => void; isPending: boolean }) {
  return (
    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">Cancelar</button>
      <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md transition-colors disabled:opacity-50">
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

// ─── Modal: Crear Ítem de Evento ───────────────────────────────────────────────
function CreateItemModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateItemEvento();
  const { data: eventos } = useEventos();

  const INIT: CreateItemEventoDTO = { eventoId: 0, resolucionId: 0, detalle: '', unidad: '', cantidad: 0, valorUnitario: 0, valorEjecutado: 0, estado: 'ACTIVO' };
  const [form, setForm] = useState(INIT);

  const numFields = ['eventoId', 'resolucionId', 'cantidad', 'valorUnitario', 'valorEjecutado'];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: numFields.includes(name) ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventoId || !form.resolucionId || !form.detalle || !form.unidad || !form.cantidad || !form.valorUnitario) {
      toast.error('Completa todos los campos obligatorios'); return;
    }
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <ModalShell title="Nuevo Ítem de Evento" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Evento</Label>
            <select name="eventoId" required className={selectClass} value={form.eventoId} onChange={handleChange}>
              <option value={0}>Selecciona un evento</option>
              {(eventos ?? []).map(ev => <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>ID de Resolución</Label>
            <input name="resolucionId" type="number" required min={1} className={inputClass} placeholder="Ej: 1" value={form.resolucionId || ''} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label>Detalle del ítem</Label>
            <input name="detalle" type="text" required className={inputClass} placeholder="Ej: Alquiler de sonido" value={form.detalle} onChange={handleChange} />
          </div>
          <div>
            <Label>Unidad</Label>
            <input name="unidad" type="text" required className={inputClass} placeholder="Ej: Global, Mes" value={form.unidad} onChange={handleChange} />
          </div>
          <div>
            <Label>Cantidad</Label>
            <input name="cantidad" type="number" required min={0} step="0.01" className={inputClass} value={form.cantidad || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Unitario ($)</Label>
            <input name="valorUnitario" type="number" required min={0} step="0.01" className={inputClass} value={form.valorUnitario || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Ejecutado ($)</Label>
            <input name="valorEjecutado" type="number" min={0} step="0.01" className={inputClass} value={form.valorEjecutado || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Estado</Label>
            <select name="estado" className={selectClass} value={form.estado} onChange={handleChange}>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>
        <ModalFooter onClose={onClose} isPending={createMutation.isPending} />
      </form>
    </ModalShell>
  );
}

// ─── Modal: Crear Pool Transversal ─────────────────────────────────────────────
function CreatePoolModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreatePool();
  const { data: festivales } = useFestivales();

  const INIT: CreatePoolTransversalDTO = { festivalId: 0, resolucionId: 0, nombre: '', unidad: '', cantidadTotal: 0, cantidadConsumida: 0, valorTotal: 0, valorConsumido: 0, estado: 'DISPONIBLE' };
  const [form, setForm] = useState(INIT);

  const numFields = ['festivalId', 'resolucionId', 'cantidadTotal', 'cantidadConsumida', 'valorTotal', 'valorConsumido'];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: numFields.includes(name) ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.festivalId || !form.resolucionId || !form.nombre || !form.unidad || !form.cantidadTotal || !form.valorTotal) {
      toast.error('Completa todos los campos obligatorios'); return;
    }
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <ModalShell title="Nuevo Pool Transversal" onClose={onClose}>
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
            <Label>Nombre del Pool</Label>
            <input name="nombre" type="text" required className={inputClass} placeholder="Ej: Radios de comunicación" value={form.nombre} onChange={handleChange} />
          </div>
          <div>
            <Label>Unidad</Label>
            <input name="unidad" type="text" required className={inputClass} placeholder="Ej: Und, Kit" value={form.unidad} onChange={handleChange} />
          </div>
          <div>
            <Label>Cantidad Total</Label>
            <input name="cantidadTotal" type="number" required min={0} step="0.01" className={inputClass} value={form.cantidadTotal || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Cantidad Consumida</Label>
            <input name="cantidadConsumida" type="number" min={0} step="0.01" className={inputClass} value={form.cantidadConsumida || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Total ($)</Label>
            <input name="valorTotal" type="number" required min={0} step="0.01" className={inputClass} value={form.valorTotal || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor Consumido ($)</Label>
            <input name="valorConsumido" type="number" min={0} step="0.01" className={inputClass} value={form.valorConsumido || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Estado</Label>
            <select name="estado" className={selectClass} value={form.estado} onChange={handleChange}>
              <option value="DISPONIBLE">Disponible</option>
              <option value="EN_USO">En uso</option>
              <option value="AGOTADO">Agotado</option>
            </select>
          </div>
        </div>
        <ModalFooter onClose={onClose} isPending={createMutation.isPending} />
      </form>
    </ModalShell>
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
