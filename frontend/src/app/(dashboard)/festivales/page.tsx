'use client';

import { useState } from 'react';
import { Plus, TentTree, MoreVertical, Edit2, Trash2, LayoutDashboard } from 'lucide-react';
import { useFestivales, useCreateFestival, useDeleteFestival } from '@/hooks/useFestivales';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FestivalesPage() {
  const { data: festivales, isLoading, isError } = useFestivales();
  const deleteMutation = useDeleteFestival();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <TentTree className="w-6 h-6 text-[var(--color-primary)]" />
            Gestión de Festivales
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra los años y versiones del Festival del Bambuco.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Festival
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {/* Skeleton Loader */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-8"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-16 ml-auto"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">
            <p>Ocurrió un error al cargar los festivales. Verifica que el servidor Backend esté en ejecución.</p>
          </div>
        ) : (!festivales || festivales.length === 0) ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <TentTree className="w-12 h-12 mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">No hay festivales</h3>
            <p className="mt-1">Comienza creando un nuevo festival para organizar el año actual.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">ID</th>
                  <th scope="col" className="px-6 py-4 font-medium">Nombre de la Versión</th>
                  <th scope="col" className="px-6 py-4 font-medium">Año</th>
                  <th scope="col" className="px-6 py-4 font-medium">Estado</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {festivales.map((festival) => (
                  <tr key={festival.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{festival.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{festival.nombre}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {festival.anio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          festival.esVigente 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        )}
                      >
                        {festival.esVigente ? 'Vigente' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/festivales/${festival.id}/eventos`} title="Ver Eventos" className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm('¿Estás seguro de eliminar este festival? Puede contener eventos asociados.')) {
                              deleteMutation.mutate(festival.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Creación Simple */}
      <CreateFestivalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}

// Componente Interno para el modal (Por simplicidad en la prueba estructural va aquí)
function CreateFestivalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createMutation = useCreateFestival();
  const [nombre, setNombre] = useState('');
  const [version, setVersion] = useState(64);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState('PLANEACION');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !version || !anio || !fechaInicio || !fechaFin || !estado) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    createMutation.mutate(
      { 
        nombre, 
        version: Number(version), 
        anio: Number(anio),
        fechaInicio,
        fechaFin,
        estado 
      },
      {
        onSuccess: () => {
          setNombre('');
          setVersion(64);
          setAnio(new Date().getFullYear());
          setFechaInicio('');
          setFechaFin('');
          setEstado('PLANEACION');
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Crear Nuevo Festival</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder="Ej: Festival del Bambuco"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Versión</label>
              <input 
                type="number" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                value={version}
                onChange={(e) => setVersion(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
              <input 
                type="number" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                value={anio}
                onChange={(e) => setAnio(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Inicio</label>
              <input 
                type="date" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Fin</label>
              <input 
                type="date" 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="PLANEACION">Planeación</option>
                <option value="EN_CURSO">En Curso</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="LIQUIDADO">Liquidado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-md transition-colors flex items-center gap-2"
            >
              {createMutation.isPending ? 'Guardando...' : 'Guardar Festival'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
