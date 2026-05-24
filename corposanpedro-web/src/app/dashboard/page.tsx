"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchDashboardOperativo, setToken } from "@/lib/api";
import dynamic from "next/dynamic";
import {
  Users, Navigation, Pause, Play, RefreshCw,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

interface Ubicacion {
  id: number;
  jornadaId: number;
  personalId: number;
  latitud: number;
  longitud: number;
  precisionGps: number | null;
  timestamp: string;
}

interface PersonalCampo {
  id: number;
  personalId: number;
  nombrePersonal: string;
  documento: string;
  numeroCamiseta: number | null;
  fotoPerfil: string | null;
  eventoId: number | null;
  nombreEvento: string | null;
  estado: string;
  fechaInicio: string;
  fechaFin: string | null;
  ultimaUbicacion: Ubicacion | null;
}

interface DashboardData {
  totalActivos: number;
  totalEnRuta: number;
  totalEnPausa: number;
  totalJornadasActivas: number;
  personalEnCampo: PersonalCampo[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const result = await fetchDashboardOperativo();
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Sesión expirada") return;
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/");
      return;
    }
    setToken(stored);
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [router, loadData]);

  const markers = data?.personalEnCampo
    .filter((p) => p.ultimaUbicacion != null)
    .map((p) => ({
      lat: p.ultimaUbicacion!.latitud,
      lng: p.ultimaUbicacion!.longitud,
      name: p.nombrePersonal,
      estado: p.estado,
      evento: p.nombreEvento,
    })) ?? [];

  const estadoBadge = (estado: string) => {
    const map: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
      ACTIVO: { bg: "#E8F5EE", color: "var(--color-green)", icon: <Play size={12} /> },
      EN_RUTA: { bg: "#FFF8E1", color: "var(--color-gold)", icon: <Navigation size={12} /> },
      PAUSA: { bg: "#F5F5F0", color: "var(--color-gray)", icon: <Pause size={12} /> },
    };
    const s = map[estado] ?? { bg: "#F5F5F0", color: "var(--color-gray)", icon: null };
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: s.bg, color: s.color }}>
        {s.icon}
        {estado === "ACTIVO" ? "Activo" : estado === "EN_RUTA" ? "En Ruta" : estado === "PAUSA" ? "Pausa" : estado}
      </span>
    );
  };

  return (
    <>
      {loading && !data && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2"
                 style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl text-sm mb-4" style={{ backgroundColor: "#FDECEA", color: "var(--color-primary)" }}>
            {error}
            <button onClick={loadData} className="ml-2 underline">Reintentar</button>
          </div>
        )}

        {data && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-xl" style={{ color: "var(--color-dark-brown)" }}>Panel Operativo</h2>
                <p className="text-xs mt-1" style={{ color: "var(--color-gray)" }}>Monitoreo en tiempo real</p>
              </div>
              <button onClick={loadData} className="p-2 rounded-lg hover:bg-gray-50"
                      style={{ color: "var(--color-gray)" }}>
                <RefreshCw size={18} />
              </button>
            </div>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <KpiCard icon={<Play size={20} />} label="Activos" value={data.totalActivos} color="var(--color-green)" />
              <KpiCard icon={<Navigation size={20} />} label="En Ruta" value={data.totalEnRuta} color="var(--color-gold)" />
              <KpiCard icon={<Pause size={20} />} label="En Pausa" value={data.totalEnPausa} color="var(--color-gray)" />
              <KpiCard icon={<Users size={20} />} label="Total en Campo" value={data.totalJornadasActivas} color="var(--color-primary)" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-4 border"
                   style={{ borderColor: "var(--color-beige)" }}>
                <h2 className="font-semibold mb-3" style={{ color: "var(--color-dark-brown)" }}>
                  Mapa de Operaciones
                </h2>
                <div className="rounded-xl overflow-hidden" style={{ height: 420 }}>
                  <MapView markers={markers} />
                </div>
              </div>

              {/* Lista de personal */}
              <div className="bg-white rounded-2xl p-4 border"
                   style={{ borderColor: "var(--color-beige)" }}>
                <h2 className="font-semibold mb-3" style={{ color: "var(--color-dark-brown)" }}>
                  Personal en Campo
                </h2>
                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {data.personalEnCampo.length === 0 && (
                    <p className="text-sm text-center py-8" style={{ color: "var(--color-gray)" }}>
                      No hay personal en campo
                    </p>
                  )}
                  {data.personalEnCampo.map((p) => (
                    <div key={p.id}
                         className="p-3 rounded-xl border transition-colors hover:bg-gray-50"
                         style={{ borderColor: "var(--color-beige)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                             style={{ backgroundColor: "var(--color-primary)" }}>
                          {p.nombrePersonal.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--color-dark-brown)" }}>
                            {p.nombrePersonal}
                          </p>
                          <p className="text-xs" style={{ color: "var(--color-gray)" }}>
                            {p.nombreEvento ?? "Sin evento"} {p.numeroCamiseta ? `· #${p.numeroCamiseta}` : ""}
                          </p>
                        </div>
                        {estadoBadge(p.estado)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
}

function KpiCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: "var(--color-beige)" }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-dark-brown)" }}>{value}</p>
          <p className="text-xs" style={{ color: "var(--color-gray)" }}>{label}</p>
        </div>
      </div>
    </div>
  );
}
