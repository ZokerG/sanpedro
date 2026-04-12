'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Users, Plus, Trash2, PowerOff, QrCode, IdCard, X,
  Shirt, ChevronLeft, ChevronRight, Search, Filter, RotateCcw, FolderOpen,
  AlertCircle, CheckCircle2, Send, Clock, CheckCircle, XCircle,
  Edit2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  usePersonal,
  useCreatePersonal,
  useUpdatePersonal,
  useDesactivarPersonal,
  useDeletePersonal,
} from '@/hooks/usePersonal';
import {
  useAsignacionesEvento,
  useAsignacionesPersonal,
  useCreateAsignacion,
  useDesactivarAsignacion,
  useDeleteAsignacion,
} from '@/hooks/useAsignacion';
import { useEventos } from '@/hooks/useEventos';
import { useRoles } from '@/hooks/useRoles';
import { useBancos } from '@/hooks/useBancos';
import { useTiposCuenta } from '@/hooks/useTiposCuenta';
import { useSolicitudesPendientesEvento, useAprobarSolicitud, useRechazarSolicitud } from '@/hooks/useSolicitudes';
import { Personal, CreatePersonalDTO, TipoDocumento, TIPO_DOCUMENTO_LABELS } from '@/models/personal';
import { AsignacionPersonal } from '@/models/asignacion';
import { Rol } from '@/models/rol';
import { CarnetModal } from '@/components/logistica/CarnetModal';
import { DocumentosModal } from '@/components/personal/DocumentosModal';
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
type Tab = 'personal' | 'asignaciones' | 'solicitudes';

export default function LogisticaPage() {
  const [tab, setTab] = useState<Tab>('personal');
  const [selectedEventoId, setSelectedEventoId] = useState<string>('');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-red-600" />
          Personal Logístico
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Administra los colaboradores de logística, asignaciones y solicitudes de participación.
        </p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {([
          ['personal', 'Expedientes'],
          ['asignaciones', 'Asignaciones a Eventos'],
          ['solicitudes', 'Solicitudes'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === key
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'personal' && <TabPersonal />}
      {tab === 'asignaciones' && <TabAsignaciones />}
      {tab === 'solicitudes' && (
        <TabSolicitudes
          selectedEventoId={selectedEventoId}
          onEventoChange={setSelectedEventoId}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// TAB: Personal Logístico
// ─────────────────────────────────────────
const PAGE_SIZE = 8;

function TabPersonal() {
  const { data: personal = [], isLoading, isError } = usePersonal('LOGISTICO');
  const updateMutation = useUpdatePersonal();
  const desactivarMutation = useDesactivarPersonal();
  const deleteMutation = useDeletePersonal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPersonal, setEditPersonal] = useState<Personal | null>(null);
  const [qrPersonal, setQrPersonal] = useState<Personal | null>(null);
  const [carnetPersonal, setCarnetPersonal] = useState<Personal | null>(null);
  const [docsPersonal, setDocsPersonal] = useState<Personal | null>(null);

  const handleEdit = (p: Personal) => {
    setEditPersonal(p);
  };

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroCamiseta, setFiltroCamiseta] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const filtrado = useMemo(() => {
    return personal.filter((p) => {
      const dbSearch = `${p.primerNombre} ${p.primerApellido} ${p.numeroDocumento}`.toLowerCase();
      if (busqueda && !dbSearch.includes(busqueda.toLowerCase())) return false;
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
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Registrar Logístico
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Búsqueda por nombre o CC */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar (Nombre o Documento)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ej: Juan Perez o 1075..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
              />
            </div>
          </div>

          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5" /> N° Camiseta
            </label>
            <input
              type="number"
              placeholder="Ej: 5"
              value={filtroCamiseta}
              onChange={(e) => setFiltroCamiseta(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            />
          </div>

          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

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
            No hay logísticos que coincidan con los filtros aplicados.
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
          <div className="p-12 text-center text-red-600">Error cargando logísticos.</div>
        ) : personal.length === 0 ? (
          <div className="p-16 text-center text-slate-500">No hay personal logístico registrado.</div>
        ) : filtrado.length === 0 ? null : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Documento</th>
                    <th className="px-6 py-4 font-medium">Rol Asignado</th>
                    <th className="px-6 py-4 font-medium text-center">
                      <span className="flex items-center gap-1 justify-center"><Shirt className="w-3.5 h-3.5" /> Camiseta</span>
                    </th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-center">Documentos</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{p.nombreCompleto}</div>
                        <div className="text-xs text-slate-400">Usuario: {p.usuarioEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">{TIPO_DOCUMENTO_LABELS[p.tipoDocumento]}</span>
                        <div className="font-mono text-slate-800">{p.numeroDocumento}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{p.cargoNombre || 'Sin Rol'}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-800">#{p.numeroCamiseta}</td>
                      <td className="px-6 py-4">
                        {p.activo
                          ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">Activo</span>
                          : <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium border border-slate-200">Inactivo</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.documentosCompletos ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200" title="Todos los documentos mínimos verificados">
                            <CheckCircle2 className="w-3.5 h-3.5" /> OK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium border border-amber-200" title="Documentos pendientes o no verificados">
                            <AlertCircle className="w-3.5 h-3.5" /> Incompleto
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(p)} title="Editar"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setCarnetPersonal(p)} title="Ver Carnet"
                            className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md transition-colors">
                            <IdCard className="w-4 h-4" />
                          </button>
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
                          <button onClick={() => setDocsPersonal(p)} title="Documentos"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <FolderOpen className="w-4 h-4" />
                          </button>
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
      <EditPersonalModal personal={editPersonal} onClose={() => setEditPersonal(null)} />
      {qrPersonal && <QrModal personal={qrPersonal} onClose={() => setQrPersonal(null)} />}
      
      {/* 
        NOTA: CarnetModal debe adaptarse para recibir la nueva interfaz 'Personal'
        en lugar de 'PersonalLogistico', pero lo resolveremos en un paso posterior.
        De momento lo mapeamos temporalmente si fuese necesario o lo usamos directo
        si el componente tolera los campos cambiados.
      */}
      {carnetPersonal && <CarnetModal personal={carnetPersonal as any} onClose={() => setCarnetPersonal(null)} />}
      
      {docsPersonal && (
        <DocumentosModal 
          personalId={docsPersonal.id} 
          personalNombre={docsPersonal.nombreCompleto} 
          isOpen={!!docsPersonal} 
          onClose={() => setDocsPersonal(null)} 
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────
// TAB: Asignaciones a Eventos
// ─────────────────────────────────────────
function TabAsignaciones() {
  // Como no hay endpoint único global para todas las asignaciones sin filtro, 
  // idealmente listaríamos un filtro por evento. Por ahora simularemos buscar
  // trayendo eventos y luego, si se selecciona un evento, se listan asignaciones.
  
  const { data: eventos = [] } = useEventos();
  const [filtroEvento, setFiltroEvento] = useState('');
  
  const { data: asignaciones = [], isLoading, isError } = useAsignacionesEvento(Number(filtroEvento));
  
  const desactivarMutation = useDesactivarAsignacion();
  const deleteMutation = useDeleteAsignacion();
  const confirmarMutation = useAsignacionMasivaMock(); // Hook local para simulaciones
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const filtrado = useMemo(() => {
    return asignaciones.filter((a) => {
      const dbSearch = `${a.nombrePersonal} ${a.apellidoPersonal} ${a.documentoPersonal}`.toLowerCase();
      if (busqueda && !dbSearch.includes(busqueda.toLowerCase())) return false;
      return true;
    });
  }, [asignaciones, busqueda]);

  const { paginated, page, totalPages, totalItems, goTo } = usePagination(filtrado, PAGE_SIZE);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Seleccione un evento para ver o gestionar permisos de acceso logístico.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Nueva Asignación
          </button>
        </div>
      </div>

      {/* Barra de filtros de eventos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Evento requerido</label>
            <select
              value={filtroEvento}
              onChange={(e) => setFiltroEvento(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            >
              <option value="">Seleccione un evento para administrar su logística...</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar asignado</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre o CC..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                disabled={!filtroEvento}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {!filtroEvento ? (
        <div className="p-16 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white">
          Seleccione un evento de la lista desplegable superior.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-4">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded animate-pulse w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-red-600">Error cargando asignaciones para este evento.</div>
          ) : asignaciones.length === 0 ? (
            <div className="p-16 text-center text-slate-500">No hay personal logístico asignado a este evento aún.</div>
          ) : filtrado.length === 0 ? null : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Personal Logístico</th>
                      <th className="px-6 py-4 font-medium">Documento</th>
                      <th className="px-6 py-4 font-medium">Rol Puesto</th>
                      <th className="px-6 py-4 font-medium">Fecha</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{a.nombrePersonal} {a.apellidoPersonal}</div>
                          <div className="text-xs text-slate-400">Camiseta #{a.numeroCamiseta}</div>
                        </td>
                        <td className="px-6 py-4 font-mono">{a.documentoPersonal}</td>
                        <td className="px-6 py-4">{a.rolAsignado || <span className="text-slate-400 italic">Punto logístico</span>}</td>
                        <td className="px-6 py-4">
                          {a.fechaAsignacion
                            ? format(new Date(a.fechaAsignacion), "dd/MM HH:mm")
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-start gap-1">
                            <button onClick={() => deleteMutation.mutate(a.id)} title="Eliminar Asignación"
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
      )}

      {/* Reusamos select evento para que asigne directo */}
      <CreateAsignacionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultEventoId={filtroEvento} />
    </>
  );
}

// Dummy hook temporal para no romper
function useAsignacionMasivaMock() {
  return {};
}

// ─────────────────────────────────────────
// TAB: Solicitudes de Participación
// ─────────────────────────────────────────
function TabSolicitudes({
  selectedEventoId,
  onEventoChange,
}: {
  selectedEventoId: string;
  onEventoChange: (id: string) => void;
}) {
  const { data: eventos = [] } = useEventos();
  const { data: solicitudes = [], isLoading } = useSolicitudesPendientesEvento(
    Number(selectedEventoId) || 0
  );
  const aprobarMutation = useAprobarSolicitud();
  const rechazarMutation = useRechazarSolicitud();

  return (
    <>
      {/* Filtro de evento */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Selecciona un evento para ver solicitudes pendientes</label>
            <select
              value={selectedEventoId}
              onChange={(e) => onEventoChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            >
              <option value="">Seleccione un evento...</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>
          {solicitudes.length > 0 && (
            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-200 shrink-0">
              {solicitudes.length} pendiente{solicitudes.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {!selectedEventoId ? (
        <div className="p-16 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white">
          <Send className="w-8 h-8 mx-auto mb-2 text-slate-200" />
          <p className="text-sm">Selecciona un evento para ver las solicitudes pendientes de aprobación.</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="p-16 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white">
          <Clock className="w-8 h-8 mx-auto mb-2 text-slate-200" />
          <p className="text-sm">No hay solicitudes pendientes para este evento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((sol) => (
            <div key={sol.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">{sol.personalNombre}</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium border border-amber-200">
                      Pendiente
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Doc: {sol.personalDocumento}</p>
                  {sol.rolAsignado && (
                    <p className="text-xs text-slate-500 mt-1">
                      Rol solicitado: <span className="font-medium text-slate-700">{sol.rolAsignado}</span>
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Solicitado el {format(new Date(sol.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => aprobarMutation.mutate(sol.id)}
                    disabled={aprobarMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                    title="Aprobar y asignar al evento"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => {
                      const nota = prompt('Motivo del rechazo (opcional):');
                      if (nota !== undefined) {
                        rechazarMutation.mutate({ solicitudId: sol.id, nota: nota || undefined });
                      }
                    }}
                    disabled={rechazarMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors disabled:opacity-50"
                    title="Rechazar solicitud"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────
// Modal: QR del Personal
// ─────────────────────────────────────────
function QrModal({ personal, onClose }: { personal: Personal; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-80 p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">QR Identidad Logística</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <QRCodeSVG value={personal.codigoQr || ''} size={200} level="H" includeMargin={false} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-800 text-lg">{personal.nombreCompleto}</p>
            <p className="text-sm text-slate-500">Doc: {personal.numeroDocumento}</p>
            {personal.numeroCamiseta && (
              <p className="text-sm text-slate-500 mt-1">Camiseta <span className="font-bold text-slate-700">#{personal.numeroCamiseta}</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Registrar Personal
// ─────────────────────────────────────────
const INITIAL_PERSONAL: Partial<CreatePersonalDTO> = {
  primerNombre: '', primerApellido: '', tipoDocumento: 'CEDULA_CIUDADANIA', numeroDocumento: '',
  tipoPersonal: 'LOGISTICO', numeroCamiseta: '' as any, cargoId: '' as any,
  email: '', telefono: '', fechaNacimiento: '', direccion: '', arl: '',
  bancoId: '' as any, tipoCuentaBancariaId: '' as any, numeroCuenta: '',
};

function CreatePersonalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreatePersonal();
  const { data: roles = [] } = useRoles();
  const { data: bancos = [] } = useBancos(true);
  const { data: tiposCuenta = [] } = useTiposCuenta(true);
  const [form, setForm] = useState(INITIAL_PERSONAL);
  const [tab, setTab] = useState<'identity' | 'contact' | 'bank'>('identity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.primerNombre || !form.primerApellido || !form.numeroDocumento || !form.numeroCamiseta) {
      toast.error('Complete los datos obligatorios (nombre, apellido, documento, camiseta)');
      return;
    }

    createMutation.mutate(
      {
        ...form,
        tipoPersonal: 'LOGISTICO',
        numeroCamiseta: Number(form.numeroCamiseta),
        cargoId: form.cargoId ? Number(form.cargoId) : undefined,
        bancoId: form.bancoId ? Number(form.bancoId) : undefined,
        tipoCuentaBancariaId: form.tipoCuentaBancariaId ? Number(form.tipoCuentaBancariaId) : undefined,
      } as CreatePersonalDTO,
      { onSuccess: () => { setForm(INITIAL_PERSONAL); setTab('identity'); onClose(); } }
    );
  };

  const tabs = [
    { key: 'identity' as const, label: 'Identidad' },
    { key: 'contact' as const, label: 'Contacto' },
    { key: 'bank' as const, label: 'Bancario' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Registrar Personal Logístico</h2>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-4">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700')}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab: Identidad */}
          {tab === 'identity' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primer Nombre *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.primerNombre} onChange={(e) => setForm({ ...form, primerNombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Segundo Nombre</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.segundoNombre || ''} onChange={(e) => setForm({ ...form, segundoNombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primer Apellido *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.primerApellido} onChange={(e) => setForm({ ...form, primerApellido: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Segundo Apellido</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.segundoApellido || ''} onChange={(e) => setForm({ ...form, segundoApellido: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Documento</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.tipoDocumento} onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value as any })}>
                  {Object.entries(TIPO_DOCUMENTO_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Documento *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.numeroDocumento} onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo (Rol)</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.cargoId} onChange={(e) => setForm({ ...form, cargoId: e.target.value as any })}>
                  <option value="">Seleccione cargo...</option>
                  {roles.filter(r => r.activo).map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">N° de Camiseta *</label>
                <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.numeroCamiseta} onChange={(e) => setForm({ ...form, numeroCamiseta: e.target.value as any })} />
              </div>
            </div>
          )}

          {/* Tab: Contacto */}
          {tab === 'contact' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="ejemplo@correo.com"
                  value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input type="tel" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="3001234567"
                  value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.fechaNacimiento || ''} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Calle 123 #45-67, Barrio"
                  value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">ARL</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: Sura, Positiva, Bolívar"
                  value={form.arl || ''} onChange={(e) => setForm({ ...form, arl: e.target.value })} />
              </div>
            </div>
          )}

          {/* Tab: Bancario */}
          {tab === 'bank' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banco</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.bancoId} onChange={(e) => setForm({ ...form, bancoId: e.target.value as any })}>
                  <option value="">Seleccione banco...</option>
                  {bancos.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Cuenta</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.tipoCuentaBancariaId} onChange={(e) => setForm({ ...form, tipoCuentaBancariaId: e.target.value as any })}>
                  <option value="">Seleccione tipo...</option>
                  {tiposCuenta.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Cuenta</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Número de cuenta bancaria"
                  value={form.numeroCuenta || ''} onChange={(e) => setForm({ ...form, numeroCuenta: e.target.value })} />
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
            * Campos obligatorios. Se generará usuario de acceso automáticamente con el documento como contraseña.
          </p>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Editar Personal
// ─────────────────────────────────────────
function EditPersonalModal({ personal, onClose }: { personal: Personal | null; onClose: () => void }) {
  const updateMutation = useUpdatePersonal();
  const { data: roles = [] } = useRoles();
  const { data: bancos = [] } = useBancos(true);
  const { data: tiposCuenta = [] } = useTiposCuenta(true);
  const [tab, setTab] = useState<'identity' | 'contact' | 'bank'>('identity');

  // Form state uses strings for all fields (HTML inputs return strings)
  const [form, setForm] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    tipoDocumento: 'CEDULA_CIUDADANIA' as any,
    numeroDocumento: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: '',
    arl: '',
    bancoId: '',
    tipoCuentaBancariaId: '',
    numeroCuenta: '',
    cargoId: '',
    numeroCamiseta: '',
  });

  useEffect(() => {
    if (personal) {
      setForm({
        primerNombre: personal.primerNombre,
        segundoNombre: personal.segundoNombre || '',
        primerApellido: personal.primerApellido,
        segundoApellido: personal.segundoApellido || '',
        tipoDocumento: personal.tipoDocumento,
        numeroDocumento: personal.numeroDocumento,
        email: personal.email || '',
        telefono: personal.telefono || '',
        fechaNacimiento: personal.fechaNacimiento || '',
        direccion: personal.direccion || '',
        arl: personal.arl || '',
        bancoId: personal.bancoId ? String(personal.bancoId) : '',
        tipoCuentaBancariaId: personal.tipoCuentaBancariaId ? String(personal.tipoCuentaBancariaId) : '',
        numeroCuenta: personal.numeroCuenta || '',
        cargoId: personal.cargoId ? String(personal.cargoId) : '',
        numeroCamiseta: personal.numeroCamiseta ? String(personal.numeroCamiseta) : '',
      });
    }
  }, [personal]);

  if (!personal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.primerNombre || !form.primerApellido || !form.numeroDocumento || !form.cargoId) {
      toast.error('Complete los datos obligatorios');
      return;
    }

    updateMutation.mutate(
      {
        id: personal.id,
        data: {
          primerNombre: form.primerNombre,
          segundoNombre: form.segundoNombre || undefined,
          primerApellido: form.primerApellido,
          segundoApellido: form.segundoApellido || undefined,
          tipoDocumento: form.tipoDocumento,
          numeroDocumento: form.numeroDocumento,
          email: form.email || undefined,
          telefono: form.telefono || undefined,
          fechaNacimiento: form.fechaNacimiento || undefined,
          direccion: form.direccion || undefined,
          arl: form.arl || undefined,
          bancoId: form.bancoId ? Number(form.bancoId) : undefined,
          tipoCuentaBancariaId: form.tipoCuentaBancariaId ? Number(form.tipoCuentaBancariaId) : undefined,
          numeroCuenta: form.numeroCuenta || undefined,
          cargoId: form.cargoId ? Number(form.cargoId) : undefined,
          numeroCamiseta: form.numeroCamiseta ? Number(form.numeroCamiseta) : undefined,
          tipoPersonal: 'LOGISTICO',
        } as CreatePersonalDTO,
      },
      { onSuccess: () => { onClose(); } }
    );
  };

  const tabs = [
    { key: 'identity' as const, label: 'Identidad' },
    { key: 'contact' as const, label: 'Contacto' },
    { key: 'bank' as const, label: 'Bancario' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Editar Personal Logístico</h2>

        <div className="flex gap-1 border-b border-slate-200 mb-4">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700')}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'identity' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primer Nombre *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.primerNombre || ''} onChange={(e) => setForm({ ...form, primerNombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Segundo Nombre</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.segundoNombre || ''} onChange={(e) => setForm({ ...form, segundoNombre: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primer Apellido *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.primerApellido || ''} onChange={(e) => setForm({ ...form, primerApellido: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Segundo Apellido</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.segundoApellido || ''} onChange={(e) => setForm({ ...form, segundoApellido: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Documento</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.tipoDocumento || ''} onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value as any })}>
                  {Object.entries(TIPO_DOCUMENTO_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Documento *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.numeroDocumento || ''} onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo (Rol)</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.cargoId} onChange={(e) => setForm({ ...form, cargoId: e.target.value as any })}>
                  <option value="">Seleccione cargo...</option>
                  {roles.filter(r => r.activo).map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">N° de Camiseta *</label>
                <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.numeroCamiseta || ''} onChange={(e) => setForm({ ...form, numeroCamiseta: e.target.value as any })} />
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico *</label>
                <input type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="ejemplo@correo.com"
                  value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                <input type="tel" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="3001234567"
                  value={form.telefono || ''} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento *</label>
                <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  value={form.fechaNacimiento || ''} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Calle 123 #45-67, Barrio"
                  value={form.direccion || ''} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">ARL *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Ej: Sura, Positiva, Bolívar"
                  value={form.arl || ''} onChange={(e) => setForm({ ...form, arl: e.target.value })} />
              </div>
            </div>
          )}

          {tab === 'bank' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banco *</label>
                <select required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.bancoId} onChange={(e) => setForm({ ...form, bancoId: e.target.value as any })}>
                  <option value="">Seleccione banco...</option>
                  {bancos.map(b => (
                    <option key={b.id} value={b.id}>{b.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Cuenta *</label>
                <select required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.tipoCuentaBancariaId} onChange={(e) => setForm({ ...form, tipoCuentaBancariaId: e.target.value as any })}>
                  <option value="">Seleccione tipo...</option>
                  {tiposCuenta.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Cuenta *</label>
                <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="Número de cuenta bancaria"
                  value={form.numeroCuenta || ''} onChange={(e) => setForm({ ...form, numeroCuenta: e.target.value })} />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={updateMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
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
function CreateAsignacionModal({ isOpen, onClose, defaultEventoId }: { isOpen: boolean; onClose: () => void, defaultEventoId: string }) {
  const createMutation = useCreateAsignacion();
  const { data: eventos } = useEventos();
  const { data: personal } = usePersonal('LOGISTICO');
  const [form, setForm] = useState({ personalId: '', eventoId: defaultEventoId, rolAsignado: '' });

  useEffect(() => {
    if (defaultEventoId) {
      setForm(f => ({ ...f, eventoId: defaultEventoId }));
    }
  }, [defaultEventoId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.personalId || !form.eventoId) { toast.error('Complete los datos'); return; }

    // Advertir si el personal tiene documentos incompletos
    const personaSeleccionada = personal?.find(p => p.id === Number(form.personalId));
    if (personaSeleccionada && !personaSeleccionada.documentosCompletos) {
      const confirmado = window.confirm(
        '⚠️ Este personal tiene documentos incompletos o sin verificar. ' +
        'El sistema no permitirá asignarlo a eventos hasta que complete y verifique todos sus documentos mínimos ' +
        '(Cédula, RUT, Certificado Bancario, Contrato Firmado, Foto de Perfil).\n\n' +
        '¿Desea continuar de todas formas?'
      );
      if (!confirmado) return;
    }

    createMutation.mutate(
      { personalId: Number(form.personalId), eventoId: Number(form.eventoId), rolAsignado: form.rolAsignado || undefined },
      {
        onSuccess: () => { setForm({ personalId: '', eventoId: defaultEventoId, rolAsignado: '' }); onClose(); },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Error al crear asignación';
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Nueva Asignación de Plaza</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Evento</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={form.eventoId} onChange={(e) => setForm({ ...form, eventoId: e.target.value })}>
              <option value="">Seleccione el evento de destino...</option>
              {eventos?.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Personal Logístico</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              value={form.personalId} onChange={(e) => setForm({ ...form, personalId: e.target.value })}>
              <option value="">Seleccione...</option>
              {personal?.filter(p => p.activo).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.documentosCompletos ? '✅' : '⚠️'} #{p.numeroCamiseta} — {p.nombreCompleto}
                  {!p.documentosCompletos ? ' (docs incompletos)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol Operativo en Evento (Opcional)</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Ej: Seguridad Puerta 1"
              value={form.rolAsignado} onChange={(e) => setForm({ ...form, rolAsignado: e.target.value })} />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md">Cancelar</button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Asignar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
