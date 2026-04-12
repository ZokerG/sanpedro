'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Users, Plus, Trash2, PowerOff, QrCode, IdCard, X,
  ChevronLeft, ChevronRight, Search, Filter, RotateCcw, FolderOpen,
  Edit2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  usePersonal,
  useCreatePersonal,
  useUpdatePersonal,
  useDesactivarPersonal,
  useDeletePersonal,
} from '@/hooks/usePersonal';
import { useRoles } from '@/hooks/useRoles';
import { useBancos } from '@/hooks/useBancos';
import { useTiposCuenta } from '@/hooks/useTiposCuenta';
import { Personal, CreatePersonalDTO, TipoDocumento, TIPO_DOCUMENTO_LABELS } from '@/models/personal';
import { CarnetModal } from '@/components/logistica/CarnetModal';
import { DocumentosModal } from '@/components/personal/DocumentosModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
const PAGE_SIZE = 8;

export default function AdministrativoPage() {
  const { data: personal = [], isLoading, isError } = usePersonal('ADMINISTRATIVO');
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
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const filtrado = useMemo(() => {
    return personal.filter((p) => {
      const dbSearch = `${p.primerNombre} ${p.primerApellido} ${p.numeroDocumento}`.toLowerCase();
      if (busqueda && !dbSearch.includes(busqueda.toLowerCase())) return false;
      if (filtroEstado === 'activo' && !p.activo) return false;
      if (filtroEstado === 'inactivo' && p.activo) return false;
      return true;
    });
  }, [personal, busqueda, filtroEstado]);

  const hayFiltros = busqueda || filtroEstado !== 'todos';
  const limpiarFiltros = () => { setBusqueda(''); setFiltroEstado('todos'); };

  const { paginated, page, totalPages, totalItems, goTo } = usePagination(filtrado, PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-800" />
          Personal Administrativo
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Administra el equipo, coordinadores y directores de CorpoSanpedro.
        </p>
      </div>

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
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Registrar Administrativo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Buscar (Nombre o Documento)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ej: Laura Gomez o 1234..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500"
              />
            </div>
          </div>
          <div className="w-36">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500"
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
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">Error cargando personales.</div>
        ) : personal.length === 0 ? (
          <div className="p-16 text-center text-slate-500">No hay personal administrativo registrado.</div>
        ) : filtrado.length === 0 ? null : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Información</th>
                    <th className="px-6 py-4 font-medium">Documento</th>
                    <th className="px-6 py-4 font-medium">Cargo</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
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
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{p.cargoNombre || 'Sin Cargo'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {p.activo
                          ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">Activo</span>
                          : <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium border border-slate-200">Inactivo</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(p)} title="Editar"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setCarnetPersonal(p)} title="Ver Carnet"
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button onClick={() => setQrPersonal(p)} title="Ver QR"
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
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
      {carnetPersonal && <CarnetModal personal={carnetPersonal as any} onClose={() => setCarnetPersonal(null)} />}
      {docsPersonal && (
        <DocumentosModal 
          personalId={docsPersonal.id} 
          personalNombre={docsPersonal.nombreCompleto} 
          isOpen={!!docsPersonal} 
          onClose={() => setDocsPersonal(null)} 
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: QR
// ─────────────────────────────────────────
function QrModal({ personal, onClose }: { personal: Personal; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-xl w-80 p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">QR Administrativo</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Registrar Admin (3 tabs como Logística, sin camiseta)
// ─────────────────────────────────────────
const INITIAL_ADMIN: Partial<CreatePersonalDTO> = {
  primerNombre: '', primerApellido: '', tipoDocumento: 'CEDULA_CIUDADANIA', numeroDocumento: '',
  tipoPersonal: 'ADMINISTRATIVO', cargoId: '' as any,
  email: '', telefono: '', fechaNacimiento: '', direccion: '', arl: '',
  bancoId: '' as any, tipoCuentaBancariaId: '' as any, numeroCuenta: '',
};

function CreatePersonalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreatePersonal();
  const { data: roles = [] } = useRoles();
  const { data: bancos = [] } = useBancos(true);
  const { data: tiposCuenta = [] } = useTiposCuenta(true);
  const [form, setForm] = useState(INITIAL_ADMIN);
  const [tab, setTab] = useState<'identity' | 'contact' | 'bank'>('identity');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.primerNombre || !form.primerApellido || !form.numeroDocumento || !form.cargoId) {
      toast.error('Complete los datos obligatorios');
      return;
    }

    createMutation.mutate(
      {
        ...form,
        tipoPersonal: 'ADMINISTRATIVO',
        cargoId: form.cargoId ? Number(form.cargoId) : undefined,
        bancoId: form.bancoId ? Number(form.bancoId) : undefined,
        tipoCuentaBancariaId: form.tipoCuentaBancariaId ? Number(form.tipoCuentaBancariaId) : undefined,
      } as CreatePersonalDTO,
      { onSuccess: () => { setForm(INITIAL_ADMIN); setTab('identity'); onClose(); } }
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
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Registrar Personal Administrativo</h2>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-4">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-slate-800 text-slate-800'
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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Directivo (Rol) *</label>
                <select required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.cargoId} onChange={(e) => setForm({ ...form, cargoId: e.target.value as any })}>
                  <option value="">Seleccione cargo...</option>
                  {roles.filter(r => r.activo).map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
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
              className="px-4 py-2 text-sm text-white bg-slate-800 hover:bg-slate-900 rounded-md disabled:opacity-50">
              {createMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Modal: Editar Personal Administrativo
// ─────────────────────────────────────────
function EditPersonalModal({ personal, onClose }: { personal: Personal | null; onClose: () => void }) {
  const updateMutation = useUpdatePersonal();
  const { data: roles = [] } = useRoles();
  const { data: bancos = [] } = useBancos(true);
  const { data: tiposCuenta = [] } = useTiposCuenta(true);
  const [tab, setTab] = useState<'identity' | 'contact' | 'bank'>('identity');

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
          tipoPersonal: 'ADMINISTRATIVO',
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
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Editar Personal Administrativo</h2>

        <div className="flex gap-1 border-b border-slate-200 mb-4">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                tab === key
                  ? 'border-slate-800 text-slate-800'
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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Directivo (Rol) *</label>
                <select required className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
                  value={form.cargoId} onChange={(e) => setForm({ ...form, cargoId: e.target.value as any })}>
                  <option value="">Seleccione cargo...</option>
                  {roles.filter(r => r.activo).map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
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
              className="px-4 py-2 text-sm text-white bg-slate-800 hover:bg-slate-900 rounded-md disabled:opacity-50">
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
