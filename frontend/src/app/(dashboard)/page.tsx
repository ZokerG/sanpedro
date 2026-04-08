'use client';

import Link from 'next/link';
import {
  TentTree, CalendarDays, WalletCards, ListTodo,
  ArrowLeftRight, TrendingUp, CheckCircle2, Clock,
  AlertTriangle, Activity, BarChart3, RefreshCw,
} from 'lucide-react';
import { useFestivales } from '@/hooks/useFestivales';
import { useEventos } from '@/hooks/useEventos';
import { useItemsEvento, usePools, useServiciosPeriodo } from '@/hooks/usePresupuesto';
import { useTareasPadre, useSubTareas } from '@/hooks/useTareas';
import { useTraslados } from '@/hooks/useTraslados';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

const pct = (exec: number, total: number) => (total > 0 ? Math.min(100, (exec / total) * 100) : 0);

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700', className)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
  linkLabel: string;
  linkColor: string;
  loading?: boolean;
  progress?: number;
  progressColor?: string;
  badge?: { label: string; style: string };
}

function StatCard({ title, value, sub, icon, iconBg, href, linkLabel, linkColor, loading, progress, progressColor, badge }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={cn('p-3 rounded-xl', iconBg)}>{icon}</div>
        {badge && (
          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', badge.style)}>
            {badge.label}
          </span>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{sub ?? title}</p>
        </div>
      )}
      {progress !== undefined && !loading && (
        <ProgressBar value={progress} className={progressColor} />
      )}
      <Link href={href} className={cn('text-sm font-medium hover:underline mt-auto', linkColor)}>
        {linkLabel} →
      </Link>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-slate-400">{icon}</div>
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: festivales, isLoading: loadFest } = useFestivales();
  const { data: eventos, isLoading: loadEv } = useEventos();
  const { data: items, isLoading: loadItems } = useItemsEvento();
  const { data: pools, isLoading: loadPools } = usePools();
  const { data: servicios, isLoading: loadServ } = useServiciosPeriodo();
  const { data: tareas, isLoading: loadTareas } = useTareasPadre();
  const { data: subtareas, isLoading: loadSub } = useSubTareas();
  const { data: traslados, isLoading: loadTrasl } = useTraslados();

  // ── Métricas de presupuesto ──────────────────────────────────────────────
  const totalItems = items?.reduce((a, i) => a + Number(i.valorTotal), 0) ?? 0;
  const execItems  = items?.reduce((a, i) => a + Number(i.valorEjecutado), 0) ?? 0;

  const totalPools = pools?.reduce((a, p) => a + Number(p.valorTotal), 0) ?? 0;
  const execPools  = pools?.reduce((a, p) => a + Number(p.valorConsumido), 0) ?? 0;

  const totalServ  = servicios?.reduce((a, s) => a + Number(s.valorTotal), 0) ?? 0;
  const execServ   = servicios?.reduce((a, s) => a + Number(s.valorEjecutado), 0) ?? 0;

  const totalPresup = totalItems + totalPools + totalServ;
  const totalExec   = execItems  + execPools  + execServ;
  const globalPct   = pct(totalExec, totalPresup);

  // ── Métricas de tareas ───────────────────────────────────────────────────
  const tareasTotales     = tareas?.length ?? 0;
  const tareasCompletadas = tareas?.filter(t => t.estadoCalculado === 'COMPLETADA' || t.estadoCalculado === 'VERIFICADA').length ?? 0;
  const tareasEnProgreso  = tareas?.filter(t => t.estadoCalculado === 'EN_PROGRESO').length ?? 0;
  const tareasPendientes  = tareas?.filter(t => t.estadoCalculado === 'PENDIENTE').length ?? 0;
  const tareasCriticas    = tareas?.filter(t => t.prioridad === 'CRITICA' && t.estadoCalculado !== 'COMPLETADA' && t.estadoCalculado !== 'VERIFICADA').length ?? 0;

  const subtareasTotales     = subtareas?.length ?? 0;
  const subtareasCompletadas = subtareas?.filter(s => s.estado === 'COMPLETADA' || s.estado === 'VERIFICADA').length ?? 0;
  const subtareasComplPct    = pct(subtareasCompletadas, subtareasTotales);

  const totalMontosTraslados = traslados?.reduce((a, t) => a + Number(t.valor), 0) ?? 0;
  const trasladosAprobados   = traslados?.filter(t => t.estado === 'APROBADO_CON_RESOLUCION').length ?? 0;

  const loadingBudget = loadItems || loadPools || loadServ;
  const loadingOps    = loadTareas || loadSub;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Resumen financiero y operativo — Festival del Bambuco
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <RefreshCw className="w-3 h-3" />
          Actualización automática cada 30 s
        </div>
      </div>

      {/* ── KPIs principales ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Festivales"
          value={loadFest ? '—' : (festivales?.length ?? 0)}
          sub={`${festivales?.filter(f => f.esVigente).length ?? 0} vigentes`}
          icon={<TentTree className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
          href="/festivales"
          linkLabel="Ver festivales"
          linkColor="text-indigo-600"
          loading={loadFest}
        />
        <StatCard
          title="Eventos"
          value={loadEv ? '—' : (eventos?.length ?? 0)}
          sub={`${eventos?.filter(e => e.estado === 'EN_CURSO').length ?? 0} en curso`}
          icon={<CalendarDays className="w-5 h-5 text-sky-600" />}
          iconBg="bg-sky-50"
          href="/eventos"
          linkLabel="Ver eventos"
          linkColor="text-sky-600"
          loading={loadEv}
        />
        <StatCard
          title="Ejecución Global"
          value={loadingBudget ? '—' : `${globalPct.toFixed(1)}%`}
          sub={`${fmt(totalExec)} de ${fmt(totalPresup)}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          href="/presupuesto"
          linkLabel="Ver presupuesto"
          linkColor="text-emerald-600"
          loading={loadingBudget}
          progress={globalPct}
          progressColor={globalPct >= 90 ? 'bg-red-500' : globalPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}
          badge={
            globalPct >= 90
              ? { label: '⚠ Límite', style: 'bg-red-50 text-red-700 border-red-200' }
              : globalPct >= 70
              ? { label: '~ Alerta', style: 'bg-amber-50 text-amber-700 border-amber-200' }
              : { label: '✓ Normal', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
          }
        />
        <StatCard
          title="Tareas"
          value={loadingOps ? '—' : tareasTotales}
          sub={`${tareasCompletadas} completadas · ${tareasEnProgreso} en progreso`}
          icon={<ListTodo className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-50"
          href="/tareas"
          linkLabel="Administrar tareas"
          linkColor="text-violet-600"
          loading={loadingOps}
          progress={pct(tareasCompletadas, tareasTotales)}
          progressColor="bg-violet-500"
        />
      </div>

      {/* ── Sección financiera ── */}
      <div>
        <SectionHeader
          icon={<BarChart3 className="w-5 h-5" />}
          title="Módulo Financiero"
          sub="Ejecución por tipo de recurso presupuestal"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {/* Items */}
          <BudgetBlock
            loading={loadItems}
            label="Ítems de Evento"
            total={totalItems}
            exec={execItems}
            count={items?.length ?? 0}
            color="sky"
          />
          {/* Pools */}
          <BudgetBlock
            loading={loadPools}
            label="Pools Transversales"
            total={totalPools}
            exec={execPools}
            count={pools?.length ?? 0}
            color="violet"
          />
          {/* Servicios */}
          <BudgetBlock
            loading={loadServ}
            label="Servicios por Período"
            total={totalServ}
            exec={execServ}
            count={servicios?.length ?? 0}
            color="amber"
          />
        </div>
      </div>

      {/* ── Sección de operación ── */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Tareas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <SectionHeader
            icon={<Activity className="w-5 h-5" />}
            title="Estado Operativo"
            sub="Tareas padre y subtareas del festival"
          />
          {loadingOps ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  label: 'Completadas / Verificadas',
                  value: tareasCompletadas,
                  total: tareasTotales,
                  icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
                  color: 'bg-emerald-500',
                },
                {
                  label: 'En progreso',
                  value: tareasEnProgreso,
                  total: tareasTotales,
                  icon: <Clock className="w-4 h-4 text-sky-500" />,
                  color: 'bg-sky-500',
                },
                {
                  label: 'Pendientes',
                  value: tareasPendientes,
                  total: tareasTotales,
                  icon: <Clock className="w-4 h-4 text-slate-400" />,
                  color: 'bg-slate-300',
                },
                {
                  label: '🔴 Prioridad crítica sin completar',
                  value: tareasCriticas,
                  total: tareasTotales,
                  icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
                  color: 'bg-red-500',
                },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  {row.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-600 truncate">{row.label}</span>
                      <span className="text-sm font-semibold text-slate-800 shrink-0 ml-2">{row.value}</span>
                    </div>
                    <ProgressBar value={pct(row.value, row.total || 1)} className={row.color} />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtareas completadas</span>
                  <span className="font-medium text-slate-700">{subtareasCompletadas} / {subtareasTotales}</span>
                </div>
                <ProgressBar value={subtareasComplPct} className="bg-violet-400 mt-2" />
              </div>
            </div>
          )}
          <Link href="/tareas" className="block mt-5 text-sm font-medium text-violet-600 hover:underline">
            Ver todas las tareas →
          </Link>
        </div>

        {/* Traslados */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <SectionHeader
            icon={<ArrowLeftRight className="w-5 h-5" />}
            title="Traslados Presupuestales"
            sub="Movimientos de recursos entre ítems"
          />
          {loadTrasl ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Números */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total', value: traslados?.length ?? 0, style: 'text-slate-800' },
                  { label: 'Aprobados', value: trasladosAprobados, style: 'text-emerald-600' },
                  { label: 'Pendientes', value: (traslados?.length ?? 0) - trasladosAprobados - (traslados?.filter(t => t.estado === 'RECHAZADO').length ?? 0), style: 'text-amber-600' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                    <p className={cn('text-xl font-bold', m.style)}>{m.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Monto total */}
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider mb-1">Monto total trasladado</p>
                <p className="text-2xl font-bold text-indigo-800">{fmt(totalMontosTraslados)}</p>
              </div>

              {/* Últimos traslados */}
              {traslados && traslados.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Últimos registros</p>
                  <div className="space-y-2">
                    {traslados.slice(-3).reverse().map(t => (
                      <div key={t.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        <span className="text-slate-500">#{t.id} · {t.tipoOrigen} → {t.tipoDestino}</span>
                        <span className="font-medium text-slate-800">{fmt(Number(t.valor))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {traslados?.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  <ArrowLeftRight className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                  <p className="text-sm">Sin traslados registrados</p>
                </div>
              )}
            </div>
          )}
          <Link href="/traslados" className="block mt-5 text-sm font-medium text-indigo-600 hover:underline">
            Ver todos los traslados →
          </Link>
        </div>
      </div>

    </div>
  );
}

// ─── Budget Block ─────────────────────────────────────────────────────────────
type Color = 'sky' | 'violet' | 'amber';

const COLOR_MAP: Record<Color, { bar: string; text: string; bg: string; border: string }> = {
  sky:    { bar: 'bg-sky-500',    text: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-100' },
  violet: { bar: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100' },
  amber:  { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100' },
};

function BudgetBlock({ loading, label, total, exec, count, color }: {
  loading?: boolean;
  label: string;
  total: number;
  exec: number;
  count: number;
  color: Color;
}) {
  const p = pct(exec, total);
  const c = COLOR_MAP[color];

  return (
    <div className={cn('rounded-xl border p-5 space-y-3', c.bg, c.border)}>
      <div className="flex items-center justify-between">
        <p className={cn('text-sm font-semibold', c.text)}>{label}</p>
        <span className="text-xs text-slate-500 bg-white rounded-full px-2 py-0.5 border border-slate-200">{count} reg.</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-6 w-28 bg-white/70 rounded animate-pulse" />
          <div className="h-3 w-full bg-white/50 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <div>
            <p className="text-xl font-bold text-slate-900">{fmt(exec)}</p>
            <p className="text-xs text-slate-500 mt-0.5">de {fmt(total)}</p>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500">Ejecución</span>
              <span className={cn('text-xs font-bold', c.text)}>{p.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-white/60">
              <div
                className={cn('h-full rounded-full transition-all duration-700', c.bar)}
                style={{ width: `${p}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
