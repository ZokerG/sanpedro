'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Users, Plus, Trash2, PowerOff, Shuffle, QrCode, X,
  Shirt, ChevronLeft, ChevronRight, Search, Filter, RotateCcw,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  usePersonalLogistico,
  useCreatePersonalLogistico,
  useDesactivarPersonalLogistico,
  useDeletePersonalLogistico,
} from '@/hooks/usePersonalLogistico';
import {
  useAsignacionesPersonal,
  useCreateAsignacion,
  useDesactivarAsignacion,
  useDeleteAsignacion,
  useAsignacionMasiva,
} from '@/hooks/useLogistica';
import { useEventos } from '@/hooks/useEventos';
import { PersonalLogistico } from '@/models/personalLogistico';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ─────────────────────────────────────────
// Hook de paginación
// ─────────────────────────────────────────
function usePagination<T>(items: T[], pageSize = 8) {
  const [page, setPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => { setPage(1); }, [items.length]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return { paginated, page: safePage, totalPages, totalItems, goTo };
}

// ─────────────────────────────────────────
// Componente Paginación
// ─────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, pageSize, goTo }: {
  page: number; totalPages: number; totalItems: number; pageSize: number; goTo: (p: number) => void;
}) {
  if (totalItems === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const pages = useMemo(() => {
    const range: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (page > 3) range.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) range.push(i);
      if (page < totalPages - 2) range.push('...');
      range.push(totalPages);
    }
    return range;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
      <span className="text-xs text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{from}–{to}</span> de{' '}
        <span className="font-medium text-slate-700">{totalItems}</span> registros
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => goTo(page - 1)} disabled={page === 1}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`d${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
          ) : (
            <button key={p} onClick={() => goTo(p as number)}
              className={cn('w-8 h-8 rounded-md text-sm font-medium transition-colors',
                page === p ? 'bg-[var(--color-primary)] text-white' : 'text-slate-600 hover:bg-slate-200')}>
              {p}
            </button>
          )
        )}
        <button onClick={() => goTo(page + 1)} disabled={page === totalPages}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────
type Tab = 'personal' | 'asignaciones';

export default function LogisticaPage() {
  const [tab, setTab] = useState<Tab>('personal');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-[var(--color-primary)]" />
          Gestión de Logística
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Administra el personal logístico y sus asignaciones a eventos.
        </p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {([['personal', 'Personal Logístico'], ['asignaciones', 'Asignaciones a Eventos']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === key
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-slate-500 hover:text-slate-700')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'personal' ? <TabPersonal /> : <TabAsignaciones />}
    </div>
  );
}

// ─────────────────────────────────────────
// TAB: Personal Logístico
// ─────────────────────────────────────────
const PAGE_SIZE = 8;

function TabPersonal() {
  const { data: personal = [], isLoading, isError } = usePersonalLogistico();
  const desactivarMutation = useDesactivarPersonalLogistico();
  const deleteMutation = useDeletePersonalLogistico();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [qrPersonal, setQrPersonal] = useState<PersonalLogistico | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroCamiseta, setFiltroCamiseta] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const filtrado = useMemo(() => {
    return personal.filter((p) => {
      const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
      if (busqueda && !nombreCompleto.includes(busqueda.toLowerCase())) return false;
      if (filtroCamiseta && !String(p.numeroCamiseta).includes(filtroCamiseta)) return false;
      if (filtroEstado === 'activo' && !p.activo) return false;
      if (filtroEstado === 'inactivo' && p.activo) return false;
      return true;
    });
  }, [personal, busqueda, filtroCamiseta, filtroEstado]);

  const hayFiltros = busqueda || filtroCamiseta || filtroEstado !== 'todos';
  const limpiarFiltros = () => { setBusqueda(''); setFiltroCamiseta(''); setFiltroEstado('todos'); };

  const { paginated, page, totalPages, totalItems, goTo } = usePagination(filtrado, PAGE_SIZE);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {personal.length > 0 && (
            <span>
              {filtrado.length !== personal.length
                ? <><span className="font-medium text-slate-700">{filtrado.length}</span> de {personal.length} personas</>
                : <><span className="font-medium text-slate-700">{personal.length}</span> personas registradas</>}
            </span>
          )}
        </p>
        <button onClick={() => setIsCreateOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Registrar Personal
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Búsqueda por nombre */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar por nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre o apellido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Filtro número de camiseta */}
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" /> N° Camiseta
            </label>
            <input
              type="number"
              placeholder="Ej: 5"
              value={filtroCamiseta}
              onChange={(e) => setFiltroCamiseta(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Filtro estado */}
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Limpiar */}
          {hayFiltros && (
            <button onClick={limpiarFiltros}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors border border-slate-200">
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {hayFiltros && filtrado.length === 0 && (
          <p className="mt-3 text-sm text-slate-400 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            No hay personal que coincida con los filtros aplicados.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">Error cargando personal.</div>
        ) : personal.length === 0 ? (
          <div className="p-16 text-center text-slate-500">No hay personal registrado.</div>
        ) : filtrado.length === 0 ? null : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium text-center">
                      <span className="flex items-center gap-1 justify-center"><Shirt className="w-3.5 h-3.5" /> Camiseta</span>
                    </th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{p.nombre} {p.apellido}</div>
                        <div className="text-xs text-slate-400 font-mono">{p.codigoQr.slice(0, 18)}…</div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-800">#{p.numeroCamiseta}</td>
                      <td className="px-6 py-4">
                        {p.activo
                          ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">Activo</span>
                          : <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium border border-slate-200">Inactivo</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setQrPersonal(p)} title="Ver QR"
                            className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md transition-colors">
                            <QrCode className="w-4 h-4" />
                          </button>
                          {p.activo && (
                            <button onClick={() => desactivarMutation.mutate(p.id)} title="Desactivar"
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                              <PowerOff className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteMutation.mutate(p.id)} title="Eliminar"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} goTo={goTo} />
          </>
        )}
      </div>

      <CreatePersonalModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      {qrPersonal && <QrModal personal={qrPersonal} onClose={() => setQrPersonal(null)} />}
    </>
  );
}

// ─────────────────────────────────────────
// TAB: Asignaciones a Eventos
// ─────────────────────────────────────────
function TabAsignaciones() {
  const { data: asignaciones = [], isLoading, isError } = useAsignacionesPersonal();
  const { data: eventos = [] } = useEventos();
  const desactivarMutation = useDesactivarAsignacion();
  const deleteMutation = useDeleteAsignacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMasivaOpen, setIsMasivaOpen] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEvento, setFiltroEvento] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');
  const [filtroCamiseta, setFiltroCamiseta] = useState('');

  const filtrado = useMemo(() => {
    return asignaciones.filter((a) => {
      const nombreCompleto = `${a.nombrePersonal} ${a.apellidoPersonal}`.toLowerCase();
      if (busqueda && !nombreCompleto.includes(busqueda.toLowerCase())) return false;
      if (filtroEvento && String(a.eventoId) !== filtroEvento) return false;
      if (filtroCamiseta && !String(a.numeroCamiseta).includes(filtroCamiseta)) return false;
      if (filtroEstado === 'activo' && !a.activo) return false;
      if (filtroEstado === 'inactivo' && a.activo) return false;
      return true;
    });
  }, [asignaciones, busqueda, filtroEvento, filtroCamiseta, filtroEstado]);

  const hayFiltros = busqueda || filtroEvento || filtroCamiseta || filtroEstado !== 'todos';
  const limpiarFiltros = () => { setBusqueda(''); setFiltroEvento(''); setFiltroCamiseta(''); setFiltroEstado('todos'); };

  const { paginated, page, totalPages, totalItems, goTo } = usePagination(filtrado, PAGE_SIZE);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {asignaciones.length > 0 && (
            <span>
              {filtrado.length !== asignaciones.length
                ? <><span className="font-medium text-slate-700">{filtrado.length}</span> de {asignaciones.length} asignaciones</>
                : <><span className="font-medium text-slate-700">{asignaciones.length}</span> asignaciones registradas</>}
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button onClick={() => setIsMasivaOpen(true)}
            className="border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
            <Shuffle className="w-4 h-4" />
            Asignación Masiva
          </button>
          <button onClick={() => setIsModalOpen(true)}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Nueva Asignación
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Búsqueda por nombre */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar personal</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre o apellido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Filtro por evento */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Evento</label>
            <select
              value={filtroEvento}
              onChange={(e) => setFiltroEvento(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            >
              <option value="">Todos los eventos</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>

          {/* Filtro número de camiseta */}
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" /> N° Camiseta
            </label>
            <input
              type="number"
              placeholder="Ej: 5"
              value={filtroCamiseta}
              onChange={(e) => setFiltroCamiseta(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Filtro estado */}
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Limpiar */}
          {hayFiltros && (
            <button onClick={limpiarFiltros}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors border border-slate-200">
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {hayFiltros && filtrado.length === 0 && (
          <p className="mt-3 text-sm text-slate-400 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            No hay asignaciones que coincidan con los filtros aplicados.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">Error cargando asignaciones.</div>
        ) : asignaciones.length === 0 ? (
          <div className="p-16 text-center text-slate-500">No hay asignaciones registradas.</div>
        ) : filtrado.length === 0 ? null : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Personal</th>
                    <th className="px-6 py-4 font-medium">Evento</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium">Fecha Asignación</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{a.nombrePersonal} {a.apellidoPersonal}</div>
                        <div className="text-xs text-slate-400">Camiseta #{a.numeroCamiseta}</div>
                      </td>
                      <td className="px-6 py-4">{a.nombreEvento}</td>
                      <td className="px-6 py-4">{a.rolAsignado || <span className="text-slate-400 italic">Sin rol</span>}</td>
                      <td className="px-6 py-4">
                        {a.fechaAsignacion
                          ? format(new Date(a.fechaAsignacion), "d 'de' MMMM yyyy", { locale: es })
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {a.activo
                          ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">Activo</span>
                          : <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium border border-slate-200">Inactivo</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {a.activo && (
                            <button onClick={() => desactivarMutation.mutate(a.id)} title="Desactivar"
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                              <PowerOff className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteMutation.mutate(a.id)} title="Eliminar"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} goTo={goTo} />
          </>
        )}
      </div>

      <CreateAsignacionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AsignacionMasivaModal isOpen={isMasivaOpen} onClose={() => setIsMasivaOpen(false)} />
    </>
  );
}

// ─────────────────────────────────────────
// Modal: QR del Personal
// ─────────────────────────────────────────
function QrModal({ personal, onClose }: { personal: PersonalLogistico; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-80 p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">QR de Auditoría</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <QRCodeSVG value={personal.codigoQr} size={200} level="H" includeMargin={false} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800 text-lg">{personal.nombre} {personal.apellido}</p>
            <p className="text-sm text-slate-500">Camiseta <span className="font-bold text-slate-700">#{personal.numeroCamiseta}</span></p>
            <p className="text-xs text-slate-400 font-mono mt-2 break-all">{personal.codigoQr}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Registrar Personal
// ─────────────────────────────────────────
const INITIAL_PERSONAL = { nombre: '', apellido: '', numeroCamiseta: '' };

function CreatePersonalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreatePersonalLogistico();
  const { data: personalExistente = [] } = usePersonalLogistico();
  const [form, setForm] = useState(INITIAL_PERSONAL);
  const [camisetaError, setCamisetaError] = useState('');

  if (!isOpen) return null;

  const numerosOcupados = new Set(personalExistente.map((p) => p.numeroCamiseta));

  const handleCamisetaChange = (val: string) => {
    setForm({ ...form, numeroCamiseta: val });
    const num = Number(val);
    if (val && num > 0 && numerosOcupados.has(num)) {
      setCamisetaError(`El número ${num} ya está asignado a otro miembro.`);
    } else {
      setCamisetaError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.numeroCamiseta) {
      toast.error('Complete todos los campos');
      return;
    }
    if (camisetaError) {
      toast.error(camisetaError);
      return;
    }
    createMutation.mutate(
      { nombre: form.nombre, apellido: form.apellido, numeroCamiseta: Number(form.numeroCamiseta) },
      { onSuccess: () => { setForm(INITIAL_PERSONAL); setCamisetaError(''); onClose(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Registrar Personal Logístico</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Número de Camiseta</label>
            <input
              type="number" required min="1"
              className={cn(
                'w-full px-3 py-2 border rounded-md',
                camisetaError ? 'border-red-400 bg-red-50 focus:ring-red-300' : 'border-slate-300'
              )}
              placeholder="Ej: 15"
              value={form.numeroCamiseta}
              onChange={(e) => handleCamisetaChange(e.target.value)}
            />
            {camisetaError ? (
              <p className="text-xs text-red-600 mt-1 font-medium">{camisetaError}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">El QR único se genera automáticamente al guardar.</p>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending || !!camisetaError}
              className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Nueva Asignación Individual
// ─────────────────────────────────────────
const INITIAL_ASIGNACION = { personalId: '', eventoId: '', rolAsignado: '' };

function CreateAsignacionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreateAsignacion();
  const { data: eventos } = useEventos();
  const { data: personal } = usePersonalLogistico();
  const [form, setForm] = useState(INITIAL_ASIGNACION);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.personalId || !form.eventoId) { toast.error('Complete los campos obligatorios'); return; }
    createMutation.mutate(
      { personalId: Number(form.personalId), eventoId: Number(form.eventoId), rolAsignado: form.rolAsignado || undefined },
      { onSuccess: () => { setForm(INITIAL_ASIGNACION); onClose(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Nueva Asignación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Personal Logístico</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={form.personalId} onChange={(e) => setForm({ ...form, personalId: e.target.value })}>
              <option value="">Seleccione el personal...</option>
              {personal?.filter(p => p.activo).map((p) => (
                <option key={p.id} value={p.id}>#{p.numeroCamiseta} — {p.nombre} {p.apellido}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Evento</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={form.eventoId} onChange={(e) => setForm({ ...form, eventoId: e.target.value })}>
              <option value="">Seleccione un evento...</option>
              {eventos?.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol Asignado (Opcional)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Ej: Coordinador de área"
              value={form.rolAsignado} onChange={(e) => setForm({ ...form, rolAsignado: e.target.value })} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Asignación Masiva
// ─────────────────────────────────────────
const INITIAL_MASIVA = { eventoId: '', cantidad: '' };

function AsignacionMasivaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const masivaMutation = useAsignacionMasiva();
  const { data: eventos } = useEventos();
  const [form, setForm] = useState(INITIAL_MASIVA);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseInt(form.cantidad);
    if (!form.eventoId) { toast.error('Seleccione un evento'); return; }
    if (!cantidad || cantidad < 1) { toast.error('Ingrese una cantidad válida'); return; }
    masivaMutation.mutate(
      { eventoId: Number(form.eventoId), cantidad },
      { onSuccess: () => { setForm(INITIAL_MASIVA); onClose(); } }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Asignación Masiva Aleatoria</h2>
        <p className="text-sm text-slate-500 mb-4">Asigna N personal activo disponible a un evento automáticamente.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Evento</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={form.eventoId} onChange={(e) => setForm({ ...form, eventoId: e.target.value })}>
              <option value="">Seleccione un evento...</option>
              {eventos?.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de Personal</label>
            <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Ej: 5"
              value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={masivaMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50 flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              {masivaMutation.isPending ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
