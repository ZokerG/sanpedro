'use client';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Bienvenido, Moderador
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-md transition-colors ml-2">
          <UserCircle className="w-8 h-8 text-[var(--color-primary)]" />
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-medium text-slate-700 leading-tight">Usuario Activo</span>
            <span className="text-xs text-slate-500">Administrador</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center pointer"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
