'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Power, PowerOff, X } from 'lucide-react';
import {
  useRoles,
  useCreateRol,
  useUpdateRol,
  useToggleRolActive,
} from '@/hooks/useRoles';
import { toast } from 'sonner';
import { Rol } from '@/models/rol';

export default function RolesPage() {
  const { data: roles = [], isLoading, isError } = useRoles();
  const toggleMutation = useToggleRolActive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rolEdit, setRolEdit] = useState<Rol | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const filteredRoles = showInactive
    ? roles
    : roles.filter((r) => r.activo);

  const handleEdit = (rol: Rol) => {
    setRolEdit(rol);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setRolEdit(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (rol: Rol) => {
    toggleMutation.mutate(rol.id, {
      onSuccess: () =>
        toast.success(
          rol.activo ? 'Rol desactivado correctamente' : 'Rol activado correctamente'
        ),
    });
  };

  const activeCount = roles.filter((r) => r.activo).length;
  const inactiveCount = roles.filter((r) => !r.activo).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[var(--color-primary)]" />
            Gestión de Roles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los roles y sectores del sistema. Cada rol define un área de operación con permisos específicos.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Rol
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
          {activeCount} activos
        </div>
        <div className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-md text-xs font-medium border border-slate-200">
          {inactiveCount} inactivos
        </div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className="text-xs text-slate-500 hover:text-slate-700 underline ml-auto"
        >
          {showInactive ? 'Ocultar inactivos' : 'Mostrar inactivos'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando roles...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600">Error al cargar roles.</div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {showInactive
              ? 'No hay roles inactivos.'
              : 'No hay roles activos. Crea uno nuevo para comenzar.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">Descripción</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((rol) => (
                  <tr
                    key={rol.id}
                    className={`hover:bg-slate-50/50 transition-colors ${
                      !rol.activo ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {rol.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm truncate">
                      {rol.descripcion || (
                        <span className="italic text-slate-400">Sin descripción</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {rol.activo ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium border border-green-200">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-medium border border-slate-200">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(rol)}
                          disabled={toggleMutation.isPending}
                          title={rol.activo ? 'Desactivar' : 'Activar'}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          {rol.activo ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(rol)}
                          title="Editar"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateEditRolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rol={rolEdit}
      />
    </div>
  );
}

/* ─── Modal ─── */

function CreateEditRolModal({
  isOpen,
  onClose,
  rol,
}: {
  isOpen: boolean;
  onClose: () => void;
  rol: Rol | null;
}) {
  const createMutation = useCreateRol();
  const updateMutation = useUpdateRol();
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rol) {
      setForm({ nombre: rol.nombre, descripcion: rol.descripcion || '' });
    } else {
      setForm({ nombre: '', descripcion: '' });
    }
    setErrors({});
  }, [rol, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (form.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() };

    if (rol) {
      updateMutation.mutate(
        { id: rol.id, data: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {rol ? 'Editar Rol' : 'Nuevo Rol'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre / Identificador
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md text-sm uppercase placeholder:text-slate-400 ${
                errors.nombre
                  ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
                  : 'border-slate-300 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]'
              }`}
              placeholder="Ej: FINANZAS"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value.toUpperCase() })
              }
            />
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción{' '}
              <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder:text-slate-400 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              rows={3}
              placeholder="Describe el propósito de este rol o sector..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
