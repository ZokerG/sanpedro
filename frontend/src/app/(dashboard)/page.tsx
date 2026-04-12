'use client';

import Link from 'next/link';
import {
  Users, CalendarDays, Settings,
  TrendingUp, FileCheck, AlertCircle,
  Activity, BarChart3, RefreshCw,
  CheckCircle2, DollarSign,
} from 'lucide-react';
import { usePersonal } from '@/hooks/usePersonal';
import { useEventos } from '@/hooks/useEventos';
import { useRoles } from '@/hooks/useRoles';
import { cn } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700', className)}
        style={{ width: `${Math.min(100, value)}%` }}
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
  const { data: personalLogistico = [], isLoading: loadLog } = usePersonal('LOGISTICO');
  const { data: personalAdmin = [], isLoading: loadAdmin } = usePersonal('ADMINISTRATIVO');
  const { data: personalPrensa = [], isLoading: loadPrensa } = usePersonal('PRENSA');
  const { data: eventos = [], isLoading: loadEv } = useEventos();
  const { data: roles = [], isLoading: loadRoles } = useRoles(true);

  // ── Métricas de personal ──────────────────────────────────────────────
  const totalPersonal = personalLogistico.length + personalAdmin.length + personalPrensa.length;
  const personalDocsIncompletos = [
    ...personalLogistico,
    ...personalAdmin,
    ...personalPrensa,
  ].filter((p) => !p.documentosCompletos).length;

  // ── Métricas de eventos ───────────────────────────────────────────────
  const eventosEnCurso = eventos.filter((e) => e.estado === 'EN_CURSO').length;
  const eventosPlaneados = eventos.filter((e) => e.estado === 'PLANEADO' || e.estado === 'EN_PREPARACION').length;
  const presupuestoTotal = eventos.reduce((a, e) => a + (e.presupuestoAprobado || 0), 0);

  const loadingPersonal = loadLog || loadAdmin || loadPrensa;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Resumen de personal, eventos y acreditación — Festival San Pedro
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <RefreshCw className="w-3 h-3" />
          Datos en tiempo real
        </div>
      </div>

      {/* ── KPIs principales ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Personal Total"
          value={loadingPersonal ? '—' : totalPersonal}
          sub={`${personalLogistico.length} log · ${personalAdmin.length} adm · ${personalPrensa.length} prensa`}
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
          href="/logistica"
          linkLabel="Ver personal"
          linkColor="text-indigo-600"
          loading={loadingPersonal}
        />
        <StatCard
          title="Documentos Pendientes"
          value={loadingPersonal ? '—' : personalDocsIncompletos}
          sub={personalDocsIncompletos > 0 ? 'Requieren verificación' : 'Todo al día ✓'}
          icon={personalDocsIncompletos > 0 ? <AlertCircle className="w-5 h-5 text-amber-600" /> : <FileCheck className="w-5 h-5 text-emerald-600" />}
          iconBg={personalDocsIncompletos > 0 ? 'bg-amber-50' : 'bg-emerald-50'}
          href="/logistica"
          linkLabel="Gestionar expedientes"
          linkColor="text-amber-600"
          loading={loadingPersonal}
          badge={
            personalDocsIncompletos > 0
              ? { label: `⚠ ${personalDocsIncompletos} pendientes`, style: 'bg-amber-50 text-amber-700 border-amber-200' }
              : { label: '✓ Completo', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
          }
        />
        <StatCard
          title="Eventos"
          value={loadEv ? '—' : eventos.length}
          sub={`${eventosEnCurso} en curso · ${eventosPlaneados} planeados`}
          icon={<CalendarDays className="w-5 h-5 text-sky-600" />}
          iconBg="bg-sky-50"
          href="/eventos"
          linkLabel="Ver eventos"
          linkColor="text-sky-600"
          loading={loadEv}
        />
        <StatCard
          title="Presupuesto Eventos"
          value={loadEv ? '—' : fmt(presupuestoTotal)}
          sub={`${roles.length} roles configurados`}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          href="/roles"
          linkLabel="Ver roles"
          linkColor="text-emerald-600"
          loading={loadEv || loadRoles}
        />
      </div>

      {/* ── Personal por tipo ── */}
      <div>
        <SectionHeader
          icon={<Activity className="w-5 h-5" />}
          title="Personal por Tipo"
          sub="Distribución del personal registrado en el sistema"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          <PersonnelBlock
            loading={loadLog}
            label="Logístico"
            count={personalLogistico.length}
            docsOk={personalLogistico.filter((p) => p.documentosCompletos).length}
            color="red"
            href="/logistica"
          />
          <PersonnelBlock
            loading={loadAdmin}
            label="Administrativo"
            count={personalAdmin.length}
            docsOk={personalAdmin.filter((p) => p.documentosCompletos).length}
            color="slate"
            href="/administrativo"
          />
          <PersonnelBlock
            loading={loadPrensa}
            label="Prensa"
            count={personalPrensa.length}
            docsOk={personalPrensa.filter((p) => p.documentosCompletos).length}
            color="blue"
            href="/prensa"
          />
        </div>
      </div>

      {/* ── Eventos recientes ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <SectionHeader
          icon={<BarChart3 className="w-5 h-5" />}
          title="Eventos Recientes"
          sub="Últimos eventos registrados con su estado"
        />
        {loadEv ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />)}
          </div>
        ) : eventos.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-200" />
            <p className="text-sm">Sin eventos registrados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {eventos.slice(-5).reverse().map((ev) => (
              <div key={ev.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                <div className="flex items-center gap-3">
                  <EstadoBadge estado={ev.estado} />
                  <span className="font-medium text-slate-800">{ev.nombre}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  {ev.limitePersonal && (
                    <span>{ev.totalAsignados || 0}/{ev.limitePersonal} asignados</span>
                  )}
                  {ev.presupuestoAprobado && <span>{fmt(ev.presupuestoAprobado)}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Personnel Block ──────────────────────────────────────────────────────────
type BlockColor = 'red' | 'slate' | 'blue';

const BLOCK_COLORS: Record<BlockColor, { text: string; bg: string; border: string; bar: string; dot: string }> = {
  red:   { text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100',    bar: 'bg-red-500',    dot: 'bg-red-400' },
  slate: { text: 'text-slate-700',  bg: 'bg-slate-50',  border: 'border-slate-100',  bar: 'bg-slate-500',  dot: 'bg-slate-400' },
  blue:  { text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100',   bar: 'bg-blue-500',   dot: 'bg-blue-400' },
};

function PersonnelBlock({ loading, label, count, docsOk, color, href }: {
  loading?: boolean;
  label: string;
  count: number;
  docsOk: number;
  color: BlockColor;
  href: string;
}) {
  const c = BLOCK_COLORS[color];
  const docsPct = count > 0 ? (docsOk / count) * 100 : 0;

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
            <div className="flex items-center gap-2">
              <span className={cn('text-xl font-bold', c.text)}>{docsOk}</span>
              <span className="text-xs text-slate-400">/ {count} con docs verificados</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-slate-500">Documentación</span>
              <span className={cn('text-xs font-bold', c.text)}>{docsPct.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-white/60">
              <div
                className={cn('h-full rounded-full transition-all duration-700', c.bar)}
                style={{ width: `${docsPct}%` }}
              />
            </div>
          </div>
        </>
      )}
      <Link href={href} className={cn('block text-xs font-medium hover:underline', c.text)}>
        Ver {label.toLowerCase()} →
      </Link>
    </div>
  );
}

// ─── Estado Badge ─────────────────────────────────────────────────────────────
const ESTADO_STYLES: Record<string, string> = {
  PLANEADO: 'bg-slate-100 text-slate-600 border-slate-200',
  EN_PREPARACION: 'bg-amber-100 text-amber-700 border-amber-200',
  EN_CURSO: 'bg-green-100 text-green-700 border-green-200',
  EJECUTADO: 'bg-blue-100 text-blue-700 border-blue-200',
  LIQUIDADO: 'bg-purple-100 text-purple-700 border-purple-200',
};

const ESTADO_LABELS: Record<string, string> = {
  PLANEADO: 'Planeado',
  EN_PREPARACION: 'En Preparación',
  EN_CURSO: 'En Curso',
  EJECUTADO: 'Ejecutado',
  LIQUIDADO: 'Liquidado',
};

function EstadoBadge({ estado }: { estado: string }) {
  const style = ESTADO_STYLES[estado] || 'bg-slate-100 text-slate-600';
  const label = ESTADO_LABELS[estado] || estado;
  return (
    <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium border', style)}>
      {label}
    </span>
  );
}
