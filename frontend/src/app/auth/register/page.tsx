'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/authService';
import { useRouter } from 'next/navigation';
import { TentTree } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'ADMIN' // Por defecto
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.email,
        contrasena: formData.password,
        rol: formData.rol
      };
      await authService.register(payload);
      toast.success('Cuenta registrada correctamente, ya puedes iniciar sesión.');
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-teal-50/50">
            <TentTree size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 mt-2">Sistema Administrativo CorpoSanpedro</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input 
                required type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20" 
                value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input 
                required type="text" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20" 
                value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input 
              required type="email" 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20" 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              required type="password" minLength={6}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20" 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}
            >
              <option value="ADMIN">Administrador</option>
              <option value="DIRECTOR">Director</option>
              {/* <option value="USER">Usuario (Tareas)</option>  Depending on backend roles */}
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm shadow-teal-600/20 transition-all disabled:opacity-70"
          >
            {loading ? 'Registrando...' : 'Registrar Cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-teal-600 font-semibold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
