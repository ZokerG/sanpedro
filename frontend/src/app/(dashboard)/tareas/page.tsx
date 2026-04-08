'use client';

import { useState } from 'react';
import {
  ListTodo, Plus, Trash2, ChevronDown, ChevronRight,
  AlertCircle, X, Circle, CheckCircle2, Loader2, ShieldCheck,
  XCircle, FlagTriangleRight,
} from 'lucide-react';
import {
  useTareasPadre, useCreateTareaPadre, useDeleteTareaPadre,
  useSubTareasByTareaPadre, useCreateSubTarea, useDeleteSubTarea,
} from '@/hooks/useTareas';
import { useEventos } from '@/hooks/useEventos';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  TareaPadre, SubTarea,
  CreateTareaPadreDTO, CreateSubTareaDTO,
  EstadoCalculado, EstadoSubtarea, Prioridad,
} from '@/models/tareas';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRIORIDAD_STYLES: Record<Prioridad, string> = {
  CRITICA: 'bg-red-50 text-red-700 border-red-200',
  ALTA: 'bg-orange-50 text-orange-700 border-orange-200',
  MEDIA: 'bg-amber-50 text-amber-700 border-amber-200',
  BAJA: 'bg-slate-50 text-slate-600 border-slate-200',
};

const ESTADO_CALCULADO_ICON: Record<EstadoCalculado, React.ReactNode> = {
  PENDIENTE: <Circle className="w-4 h-4 text-slate-400" />,
  EN_PROGRESO: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  COMPLETADA: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  VERIFICADA: <ShieldCheck className="w-4 h-4 text-purple-500" />,
};

const ESTADO_SUBTAREA_ICON: Record<EstadoSubtarea, React.ReactNode> = {
  PENDIENTE: <Circle className="w-3.5 h-3.5 text-slate-400" />,
  EN_PROGRESO: <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />,
  COMPLETADA: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  VERIFICADA: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />,
  CANCELADA: <XCircle className="w-3.5 h-3.5 text-red-400" />,
};

const fmt = (val?: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TareasPage() {
  const { data: tareas, isLoading, isError } = useTareasPadre();
  const [modalTarea, setModalTarea] = useState(false);
  const [modalSubtarea, setModalSubtarea] = useState<number | null>(null); // tareaPadreId

  const total = tareas?.length ?? 0;
  const completadas = tareas?.filter(t => t.estadoCalculado === 'COMPLETADA' || t.estadoCalculado === 'VERIFICADA').length ?? 0;
  const enProgreso = tareas?.filter(t => t.estadoCalculado === 'EN_PROGRESO').length ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-[var(--color-primary)]" />
            Operación y Tareas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión de tareas operativas por evento con sus subtareas asignadas.
          </p>
        </div>
        <button
          onClick={() => setModalTarea(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total tareas', value: total, color: 'text-slate-800' },
          { label: 'En progreso', value: enProgreso, color: 'text-blue-600' },
          { label: 'Completadas', value: completadas, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center">
            <p className={cn('text-3xl font-bold', s.color)}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">Tareas por Evento</h2>
        </div>

        {isLoading && (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-12 text-center text-red-600 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>Error al cargar las tareas. Verifica que el servidor esté activo.</p>
          </div>
        )}

        {!isLoading && !isError && (!tareas || tareas.length === 0) && (
          <div className="p-16 text-center flex flex-col items-center text-slate-500">
            <ListTodo className="w-12 h-12 mb-4 text-slate-300" />
            <p className="font-medium text-slate-700">No hay tareas registradas</p>
            <p className="text-sm mt-1">Usa &quot;Nueva Tarea&quot; para agregar la primera.</p>
          </div>
        )}

        {!isLoading && !isError && tareas && tareas.length > 0 && (
          <div className="divide-y divide-slate-100">
            {tareas.map(tarea => (
              <TareaRow
                key={tarea.id}
                tarea={tarea}
                onAddSubtarea={() => setModalSubtarea(tarea.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modalTarea && <CreateTareaModal onClose={() => setModalTarea(false)} />}
      {modalSubtarea !== null && (
        <CreateSubtareaModal
          tareaPadreId={modalSubtarea}
          onClose={() => setModalSubtarea(null)}
        />
      )}
    </div>
  );
}

// ─── Tarea Row (expandible) ────────────────────────────────────────────────────
function TareaRow({ tarea, onAddSubtarea }: { tarea: TareaPadre; onAddSubtarea: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const deleteTarea = useDeleteTareaPadre();
  const { data: subtareas, isLoading: loadingSubs } = useSubTareasByTareaPadre(
    expanded ? tarea.id : 0
  );

  return (
    <div>
      {/* Fila principal */}
      <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50/60 transition-colors">
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors shrink-0"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="shrink-0">
          {ESTADO_CALCULADO_ICON[tarea.estadoCalculado]}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{tarea.titulo}</p>
          {tarea.descripcion && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{tarea.descripcion}</p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">Evento #{tarea.eventoId}</span>
          {tarea.itemEventoId && (
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
              Ítem #{tarea.itemEventoId}
            </span>
          )}
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full border',
            PRIORIDAD_STYLES[tarea.prioridad]
          )}>
            <FlagTriangleRight className="w-3 h-3 inline mr-1" />
            {tarea.prioridad}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onAddSubtarea}
            className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-md transition-colors text-xs"
            title="Agregar subtarea"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { if (confirm('¿Eliminar esta tarea y sus subtareas?')) deleteTarea.mutate(tarea.id); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtareas expandidas */}
      {expanded && (
        <div className="bg-slate-50/70 border-t border-slate-100">
          {loadingSubs ? (
            <div className="px-10 py-4 space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-slate-200 rounded animate-pulse" />)}
            </div>
          ) : !subtareas || subtareas.length === 0 ? (
            <div className="px-12 py-5 text-sm text-slate-400 italic flex items-center gap-2">
              <Circle className="w-3.5 h-3.5" />
              Sin subtareas —
              <button onClick={onAddSubtarea} className="text-[var(--color-primary)] hover:underline font-medium">
                Agregar una
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {subtareas.map(sub => (
                <SubTareaRow key={sub.id} sub={sub} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SubTarea Row ──────────────────────────────────────────────────────────────
function SubTareaRow({ sub }: { sub: SubTarea }) {
  const deleteSub = useDeleteSubTarea();
  const execPct = (sub.valorEjecutado && sub.valorComprometido && sub.valorComprometido > 0)
    ? Math.round((sub.valorEjecutado / sub.valorComprometido) * 100)
    : 0;

  return (
    <div className="flex items-center gap-3 px-12 py-3 hover:bg-slate-100/60 transition-colors">
      <div className="shrink-0">{ESTADO_SUBTAREA_ICON[sub.estado]}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{sub.titulo}</p>
        {sub.fechaLimite && (
          <p className="text-xs text-slate-400 mt-0.5">Límite: {sub.fechaLimite}</p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-3 shrink-0 text-xs text-slate-500">
        {sub.valorComprometido !== undefined && sub.valorComprometido > 0 && (
          <div className="flex items-center gap-2 min-w-[140px]">
            <span className="whitespace-nowrap">{fmt(sub.valorEjecutado)} / {fmt(sub.valorComprometido)}</span>
            <div className="w-16 bg-slate-200 rounded-full h-1 overflow-hidden">
              <div
                className={cn('h-1 rounded-full', execPct >= 90 ? 'bg-red-500' : execPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500')}
                style={{ width: `${Math.min(execPct, 100)}%` }}
              />
            </div>
          </div>
        )}
        <span className={cn(
          'px-2 py-0.5 rounded-full border text-xs font-medium',
          sub.estado === 'COMPLETADA' || sub.estado === 'VERIFICADA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          sub.estado === 'EN_PROGRESO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          sub.estado === 'CANCELADA' ? 'bg-red-50 text-red-600 border-red-200' :
          'bg-slate-50 text-slate-600 border-slate-200'
        )}>
          {sub.estado.replace('_', ' ')}
        </span>
      </div>

      <button
        onClick={() => { if (confirm('¿Eliminar esta subtarea?')) deleteSub.mutate(sub.id); }}
        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────
const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';
const selectClass = 'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>;
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
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

// ─── Modal: Crear TareaPadre ───────────────────────────────────────────────────
function CreateTareaModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateTareaPadre();
  const { data: eventos } = useEventos();

  const INIT: CreateTareaPadreDTO = {
    eventoId: 0,
    titulo: '',
    descripcion: '',
    prioridad: 'MEDIA',
    estadoCalculado: 'PENDIENTE',
    itemEventoId: null,
    asignacionPoolId: null,
    servicioId: null,
  };
  const [form, setForm] = useState(INIT);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numFields = ['eventoId', 'itemEventoId', 'asignacionPoolId', 'servicioId'];
    setForm(prev => ({
      ...prev,
      [name]: numFields.includes(name) ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventoId || !form.titulo) {
      toast.error('El evento y el título son obligatorios'); return;
    }
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <ModalShell title="Nueva Tarea" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Evento *</Label>
            <select name="eventoId" required className={selectClass} value={form.eventoId} onChange={handleChange}>
              <option value={0}>Selecciona un evento</option>
              {(eventos ?? []).map(ev => (
                <option key={ev.id} value={ev.id}>{ev.nombre} (#{ev.id})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Label>Título *</Label>
            <input name="titulo" type="text" required className={inputClass} placeholder="Ej: Coordinación de logística" value={form.titulo} onChange={handleChange} />
          </div>

          <div className="md:col-span-2">
            <Label>Descripción</Label>
            <textarea name="descripcion" rows={2} className={cn(inputClass, 'resize-none')} placeholder="Detalle de la tarea..." value={form.descripcion} onChange={handleChange} />
          </div>

          <div>
            <Label>Prioridad *</Label>
            <select name="prioridad" className={selectClass} value={form.prioridad} onChange={handleChange}>
              <option value="CRITICA">🔴 Crítica</option>
              <option value="ALTA">🟠 Alta</option>
              <option value="MEDIA">🟡 Media</option>
              <option value="BAJA">⚪ Baja</option>
            </select>
          </div>

          <div>
            <Label>Estado inicial *</Label>
            <select name="estadoCalculado" className={selectClass} value={form.estadoCalculado} onChange={handleChange}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="VERIFICADA">Verificada</option>
            </select>
          </div>

          <div>
            <Label>ID Ítem Evento (opcional)</Label>
            <input name="itemEventoId" type="number" min={1} className={inputClass} placeholder="Ej: 3" value={form.itemEventoId ?? ''} onChange={handleChange} />
          </div>

          <div>
            <Label>ID Servicio Período (opcional)</Label>
            <input name="servicioId" type="number" min={1} className={inputClass} placeholder="Ej: 2" value={form.servicioId ?? ''} onChange={handleChange} />
          </div>
        </div>
        <ModalFooter onClose={onClose} isPending={createMutation.isPending} />
      </form>
    </ModalShell>
  );
}

// ─── Modal: Crear SubTarea ─────────────────────────────────────────────────────
function CreateSubtareaModal({ tareaPadreId, onClose }: { tareaPadreId: number; onClose: () => void }) {
  const createMutation = useCreateSubTarea();

  const INIT: CreateSubTareaDTO = {
    tareaPadreId,
    titulo: '',
    descripcion: '',
    estado: 'PENDIENTE',
    fechaLimite: '',
    valorComprometido: 0,
    valorEjecutado: 0,
    sectorId: null,
    responsableId: null,
  };
  const [form, setForm] = useState(INIT);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numFields = ['valorComprometido', 'valorEjecutado', 'sectorId', 'responsableId'];
    setForm(prev => ({
      ...prev,
      [name]: numFields.includes(name) ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo) { toast.error('El título es obligatorio'); return; }
    const payload = {
      ...form,
      fechaLimite: form.fechaLimite || undefined,
      valorComprometido: form.valorComprometido || undefined,
      valorEjecutado: form.valorEjecutado || undefined,
    };
    createMutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <ModalShell title={`Nueva Subtarea — Tarea #${tareaPadreId}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Título *</Label>
            <input name="titulo" type="text" required className={inputClass} placeholder="Ej: Contratar empresa de sonido" value={form.titulo} onChange={handleChange} />
          </div>

          <div className="md:col-span-2">
            <Label>Descripción</Label>
            <textarea name="descripcion" rows={2} className={cn(inputClass, 'resize-none')} placeholder="Detalle..." value={form.descripcion} onChange={handleChange} />
          </div>

          <div>
            <Label>Estado *</Label>
            <select name="estado" className={selectClass} value={form.estado} onChange={handleChange}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completada</option>
              <option value="VERIFICADA">Verificada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div>
            <Label>Fecha límite</Label>
            <input name="fechaLimite" type="date" className={inputClass} value={form.fechaLimite} onChange={handleChange} />
          </div>

          <div>
            <Label>Valor comprometido ($)</Label>
            <input name="valorComprometido" type="number" min={0} step="0.01" className={inputClass} value={form.valorComprometido || ''} onChange={handleChange} />
          </div>

          <div>
            <Label>Valor ejecutado ($)</Label>
            <input name="valorEjecutado" type="number" min={0} step="0.01" className={inputClass} value={form.valorEjecutado || ''} onChange={handleChange} />
          </div>
        </div>
        <ModalFooter onClose={onClose} isPending={createMutation.isPending} />
      </form>
    </ModalShell>
  );
}
