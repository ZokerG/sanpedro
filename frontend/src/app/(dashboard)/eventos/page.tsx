'use client';

import { useState } from 'react';
import {
  CalendarDays, Plus, Trash2, Users, DollarSign,
  TrendingUp, TrendingDown, CheckCircle2, Clock,
  MapPin, ChevronDown, ChevronUp, Target,
} from 'lucide-react';
import {
  useEventos,
  useCreateEvento,
  useDeleteEvento,
  useLiquidaciones,
} from '@/hooks/useEventos';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LiquidacionEvento } from '@/models/asignacion';
import { Evento, EstadoEvento } from '@/models/evento';

const fmt = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

// ─── Estado Badge ─────────────────────────────────────────────────────────────
const ESTADO_STYLES: Record<EstadoEvento, string> = {
  PLANEADO: 'bg-slate-100 text-slate-600 border-slate-200',
  EN_PREPARACION: 'bg-amber-100 text-amber-700 border-amber-200',
  EN_CURSO: 'bg-green-100 text-green-700 border-green-200',
  EJECUTADO: 'bg-blue-100 text-blue-700 border-blue-200',
  LIQUIDADO: 'bg-purple-100 text-purple-700 border-purple-200',
};

const ESTADO_LABELS: Record<EstadoEvento, string> = {
  PLANEADO: 'Planeado',
  EN_PREPARACION: 'En Preparación',
  EN_CURSO: 'En Curso',
  EJECUTADO: 'Ejecutado',
  LIQUIDADO: 'Liquidado',
};

function EstadoBadge({ estado }: { estado: EstadoEvento }) {
  return (
    <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium border', ESTADO_STYLES[estado])}>
      {ESTADO_LABELS[estado]}
    </span>
  );
}

// ─── Event Panel Card ─────────────────────────────────────────────────────────
function EventPanel({
  evento,
  liquidacion,
  onLiquidar,
  liquidando,
}: {
  evento: Evento;
  liquidacion?: LiquidacionEvento | null;
  onLiquidar: () => void;
  liquidando: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const asignados = evento.totalAsignados || 0;
  const limite = evento.limitePersonal || 0;
  const asignacionPct = limite > 0 ? (asignados / limite) * 100 : 0;

  const presupuesto = evento.presupuestoAprobado || 0;
  const isDeficit = liquidacion?.estado === 'DEFICIT';
  const isOk = liquidacion?.estado === 'DENTRO_PRESUPUESTO';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-semibold text-slate-900 truncate">{evento.nombre}</h3>
              <EstadoBadge estado={evento.estado} />
            </div>
            {evento.ubicacionLogistica && (
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {evento.ubicacionLogistica}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              {evento.fechaInicio
                ? format(new Date(evento.fechaInicio), "d 'de' MMMM yyyy, HH:mm", { locale: es })
                : 'Sin fecha'}
              {evento.duracionHoras && evento.duracionHoras > 0 && (
                <span className="ml-2">· {evento.duracionHoras}h de duración</span>
              )}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-6 shrink-0">
            {limite > 0 && (
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Asignados</p>
                <p className="text-lg font-bold text-slate-800">
                  {asignados}<span className="text-sm text-slate-400 font-normal">/{limite}</span>
                </p>
              </div>
            )}
            {presupuesto > 0 && (
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Presupuesto</p>
                <p className="text-sm font-bold text-slate-800">{fmt(presupuesto)}</p>
              </div>
            )}
            <div className="text-slate-400">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {limite > 0 && (
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  asignacionPct >= 90 ? 'bg-red-500' : asignacionPct >= 70 ? 'bg-amber-500' : 'bg-[var(--color-primary)]'
                )}
                style={{ width: `${asignacionPct}%` }}
              />
            </div>
          </div>
        )}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4">
          {/* Liquidación */}
          {liquidacion && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5" /> Liquidación del Evento
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                  <p className="text-xs text-slate-400">Asignados</p>
                  <p className="text-lg font-bold text-slate-800">{liquidacion.totalAsignados}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                  <p className="text-xs text-slate-400">Asistentes</p>
                  <p className="text-lg font-bold text-slate-800">{liquidacion.totalAsistentes}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                  <p className="text-xs text-slate-400">Costo Real</p>
                  <p className="text-sm font-bold text-slate-800">{fmt(liquidacion.costoReal)}</p>
                </div>
                <div className={cn(
                  'rounded-lg p-3 border text-center',
                  isDeficit
                    ? 'bg-red-50 border-red-200'
                    : isOk
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-slate-200'
                )}>
                  <p className="text-xs text-slate-400">Diferencia</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    {isDeficit ? (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    ) : isOk ? (
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    ) : null}
                    <p className={cn('text-sm font-bold', isDeficit ? 'text-red-700' : isOk ? 'text-green-700' : 'text-slate-800')}>
                      {fmt(Math.abs(liquidacion.diferencia))}
                    </p>
                  </div>
                  <p className={cn('text-xs mt-0.5', isDeficit ? 'text-red-500' : isOk ? 'text-green-600' : 'text-slate-400')}>
                    {liquidacion.estado === 'DENTRO_PRESUPUESTO' ? 'Dentro del presupuesto' : 'Déficit'}
                  </p>
                </div>
              </div>

              {liquidacion.cuotaPago > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  Cuota por asistente: <span className="font-medium text-slate-600">{fmt(liquidacion.cuotaPago)}</span>
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {!liquidacion && evento.estado !== 'LIQUIDADO' && (
              <button
                onClick={onLiquidar}
                disabled={liquidando}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {liquidando ? 'Liquidando...' : 'Liquidar Evento'}
              </button>
            )}
            {liquidacion && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                Liquidación disponible
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EventosPage() {
  const { data: eventos = [], isLoading, isError } = useEventos();
  const deleteMutation = useDeleteEvento();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventoIds = eventos.map((e) => e.id);
  const { data: liquidaciones = [], isLoading: loadLiq } = useLiquidaciones(eventoIds);

  const liquidacionMap = new Map<number, LiquidacionEvento>();
  liquidaciones.forEach((liq) => liquidacionMap.set(liq.eventoId, liq));

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[var(--color-primary)]" />
            Gestión de Eventos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los eventos, cupos de personal y liquidación presupuestal.
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

      {/* Panel de Eventos */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="h-5 bg-slate-200 rounded animate-pulse w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center text-red-600">Error cargando eventos.</div>
      ) : eventos.length === 0 ? (
        <div className="p-16 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white">
          <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-200" />
          <p>No hay eventos registrados. Crea uno para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((ev) => (
            <EventPanel
              key={ev.id}
              evento={ev}
              liquidacion={liquidacionMap.get(ev.id) || null}
              onLiquidar={() => {
                toast.info('Funcionalidad de liquidación — usa el botón en el panel del evento.');
              }}
              liquidando={false}
            />
          ))}
        </div>
      )}

      <CreateEventoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

// Modal de creación
const INITIAL_FORM_STATE = {
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  duracionHoras: '',
  estado: 'PLANEADO' as const,
  prioridad: 'MEDIA' as const,
  ubicacionLogistica: '',
  limitePersonal: '',
  cuotaPago: '',
  presupuestoAprobado: '',
};

function CreateEventoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreateEvento();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.fechaInicio) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    createMutation.mutate(
      {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        fechaInicio: formData.fechaInicio,
        duracionHoras: formData.duracionHoras ? Number(formData.duracionHoras) : undefined,
        estado: formData.estado,
        prioridad: formData.prioridad,
        ubicacionLogistica: formData.ubicacionLogistica || undefined,
        limitePersonal: formData.limitePersonal ? Number(formData.limitePersonal) : undefined,
        cuotaPago: formData.cuotaPago ? Number(formData.cuotaPago) : undefined,
        presupuestoAprobado: formData.presupuestoAprobado ? Number(formData.presupuestoAprobado) : undefined,
      },
      {
        onSuccess: () => {
          setFormData(INITIAL_FORM_STATE);
          onClose();
        },
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Evento *</label>
            <input
              type="text" required
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm h-20 resize-none"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio *</label>
              <input
                type="datetime-local" required
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duración (horas)</label>
              <input
                type="number" min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder="Ej: 4"
                value={formData.duracionHoras}
                onChange={(e) => setFormData({ ...formData, duracionHoras: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">La fecha fin se calcula automáticamente</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
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
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as any })}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>

          {/* Logístico */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Control Logístico
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Límite Personal</label>
                <input
                  type="number" min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: 50"
                  value={formData.limitePersonal}
                  onChange={(e) => setFormData({ ...formData, limitePersonal: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cuota por Asistente</label>
                <input
                  type="number" min="0" step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: 50000"
                  value={formData.cuotaPago}
                  onChange={(e) => setFormData({ ...formData, cuotaPago: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Presupuesto Aprobado</label>
                <input
                  type="number" min="0" step="0.01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: 5000000"
                  value={formData.presupuestoAprobado}
                  onChange={(e) => setFormData({ ...formData, presupuestoAprobado: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación Logística</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: Entrada Sur, Bodega 3"
                  value={formData.ubicacionLogistica}
                  onChange={(e) => setFormData({ ...formData, ubicacionLogistica: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">
              Cancelar
            </button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
