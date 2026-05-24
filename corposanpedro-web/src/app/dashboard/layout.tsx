"use client";

import { useState, useEffect, useId } from "react";
import { useRouter, usePathname } from "next/navigation";
import { setToken } from "@/lib/api";
import {
  LogOut, Banknote, Menu, X, ChevronLeft, Activity, Newspaper,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Operativo", icon: Activity, color: "#3B82F6" },
  { href: "/dashboard/finanzas", label: "Finanzas", icon: Banknote, color: "#10B981" },
  { href: "/dashboard/noticias", label: "Noticias", icon: Newspaper, color: "#F59E0B" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarWidth = collapsed ? 72 : 260;
  const wrapperId = useId();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
    else router.push("/");
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F7F4" }}>
      {/* Inline responsive sidebar-width style for desktop */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [data-sidebar-spacer="${wrapperId}"] {
            margin-left: 0;
          }
          @media (min-width: 1024px) {
            [data-sidebar-spacer="${wrapperId}"] {
              margin-left: ${sidebarWidth}px;
            }
          }
        `
      }} />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="fixed top-0 left-0 z-50 h-full transition-all duration-300 hidden lg:flex flex-col"
        style={{
          width: sidebarWidth,
          background: "linear-gradient(180deg, #2D1B0E 0%, #1A0F06 100%)",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: "var(--color-dark-brown)" }}
        >
          <ChevronLeft
            size={14}
            color="#FFF"
            style={{
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-5 border-b"
               style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: "linear-gradient(135deg, var(--color-primary), #E74C3C)" }}>
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-white truncate">CorpoSanpedro</h1>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Panel de Gestión</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 rounded-xl transition-all duration-200 group"
                  style={{
                    padding: collapsed ? "10px" : "10px 14px",
                    backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="shrink-0 p-1.5 rounded-lg transition-colors"
                       style={{ backgroundColor: active ? `${item.color}30` : "transparent" }}>
                    <Icon size={20} style={{ color: active ? item.color : "rgba(255,255,255,0.45)" }} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium truncate"
                            style={{ color: active ? "#FFF" : "rgba(255,255,255,0.65)" }}>
                        {item.label}
                      </span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t px-3 py-4"
               style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.55)" }}
              title={collapsed ? "Salir" : undefined}
            >
              <LogOut size={18} />
              {!collapsed && <span>Salir</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 z-50 h-full w-[260px] transition-transform duration-300 lg:hidden flex flex-col"
        style={{
          background: "linear-gradient(180deg, #2D1B0E 0%, #1A0F06 100%)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={20} color="rgba(255,255,255,0.55)" />
        </button>

        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-5 border-b"
               style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: "linear-gradient(135deg, var(--color-primary), #E74C3C)" }}>
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-white truncate">CorpoSanpedro</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Panel de Gestión</p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => { router.push(item.href); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 rounded-xl px-[14px] py-2.5 transition-all duration-200"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent" }}
                >
                  <div className="shrink-0 p-1.5 rounded-lg"
                       style={{ backgroundColor: active ? `${item.color}30` : "transparent" }}>
                    <Icon size={20} style={{ color: active ? item.color : "rgba(255,255,255,0.45)" }} />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium truncate"
                        style={{ color: active ? "#FFF" : "rgba(255,255,255,0.65)" }}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t px-3 py-4"
               style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div data-sidebar-spacer={wrapperId} className="flex-1 flex flex-col transition-[margin-left] duration-300">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3"
             style={{ background: "linear-gradient(135deg, #2D1B0E, #1A0F06)" }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu size={22} color="#FFF" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, var(--color-primary), #E74C3C)" }}>
              <span className="text-white font-bold text-xs">CS</span>
            </div>
            <span className="text-white font-semibold text-sm">CorpoSanpedro</span>
          </div>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <LogOut size={20} color="rgba(255,255,255,0.55)" />
          </button>
        </div>

        <main className="flex-1">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
