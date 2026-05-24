"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  fetchSolicitudesCompra, fetchSolicitudesPendientes,
  aprobarSolicitud, rechazarSolicitud, registrarTransferencia,
  setToken, SolicitudCompraResponse,
} from "@/lib/api";
import {
  ShoppingCart, Clock, CheckCircle, XCircle, RefreshCw,
  DollarSign, Image as ImageIcon, Upload, Filter, Eye,
} from "lucide-react";

const categorias: Record<string, { label: string; color: string }> = {
  TRANSPORTE: { label: "Transporte", color: "#3B82F6" },
  INSUMOS: { label: "Insumos", color: "#8B5CF6" },
  ALIMENTACION: { label: "Alimentación", color: "#F59E0B" },
  OTROS: { label: "Otros", color: "#6B7280" },
};

export default function FinanzasPage() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<SolicitudCompraResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState<"TODAS" | "PENDIENTE" | "APROBADA" | "RECHAZADA">("PENDIENTE");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notaRechazo, setNotaRechazo] = useState("");
  const [showRechazar, setShowRechazar] = useState(false);
  const [showTransferencia, setShowTransferencia] = useState(false);
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError("");
      let data: SolicitudCompraResponse[];
      if (filtro === "PENDIENTE") {
        data = await fetchSolicitudesPendientes();
      } else {
        data = await fetchSolicitudesCompra();
        if (filtro !== "TODAS") {
          data = data.filter((s) => s.estado === filtro);
        }
      }
      setSolicitudes(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Sesión expirada") return;
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) { router.push("/"); return; }
    setToken(stored);
    loadData();
  }, [router, loadData]);

  async function handleAprobar(id: number) {
    setActionLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await aprobarSolicitud(id, user.id || 1);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRechazar() {
    if (!selectedId) return;
    setActionLoading(true);
    try {
      await rechazarSolicitud(selectedId, notaRechazo || undefined);
      setShowRechazar(false);
      setNotaRechazo("");
      setSelectedId(null);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleTransferencia() {
    if (!selectedId) return;
    setActionLoading(true);
    try {
      const fd = new FormData();
      if (comprobanteFile) fd.append("comprobante", comprobanteFile);
      await registrarTransferencia(selectedId, fd);
      setShowTransferencia(false);
      setComprobanteFile(null);
      setSelectedId(null);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar transferencia");
    } finally {
      setActionLoading(false);
    }
  }

  const totales = {
    pendientes: solicitudes.filter((s) => s.estado === "PENDIENTE").length,
    aprobadas: solicitudes.filter((s) => s.estado === "APROBADA").length,
    rechazadas: solicitudes.filter((s) => s.estado === "RECHAZADA").length,
    montoTotal: solicitudes.reduce((sum, s) => sum + s.monto, 0),
  };

  const formatoCOP = (monto: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(monto);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-xl" style={{ color: "var(--color-dark-brown)" }}>Panel Financiero</h2>
          <p className="text-xs mt-1" style={{ color: "var(--color-gray)" }}>Solicitudes de compra y aprobación gerencial</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-lg hover:bg-gray-50"
                style={{ color: "var(--color-gray)" }}>
          <RefreshCw size={18} />
        </button>
      </div>

      {loading && (
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

      {!loading && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard icon={<Clock size={20} />} label="Pendientes" value={totales.pendientes} color="#F59E0B" />
            <KpiCard icon={<CheckCircle size={20} />} label="Aprobadas" value={totales.aprobadas} color="var(--color-green)" />
            <KpiCard icon={<XCircle size={20} />} label="Rechazadas" value={totales.rechazadas} color="var(--color-primary)" />
            <KpiCard icon={<DollarSign size={20} />} label="Monto Total" value={totales.montoTotal} color="var(--color-dark-brown)" isCurrency />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} style={{ color: "var(--color-gray)" }} />
            {(["TODAS", "PENDIENTE", "APROBADA", "RECHAZADA"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFiltro(f); setLoading(true); }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: filtro === f ? "var(--color-primary)" : "transparent",
                  color: filtro === f ? "#FFF" : "var(--color-gray)",
                  border: filtro !== f ? "1px solid var(--color-beige)" : "none",
                }}
              >
                {f === "TODAS" ? "Todas" : f === "PENDIENTE" ? "Pendientes" : f === "APROBADA" ? "Aprobadas" : "Rechazadas"}
              </button>
            ))}
          </div>

          {/* Tabla de solicitudes */}
          <div className="bg-white rounded-2xl border overflow-hidden"
               style={{ borderColor: "var(--color-beige)" }}>
            {solicitudes.length === 0 ? (
              <p className="text-sm text-center py-12" style={{ color: "var(--color-gray)" }}>
                No hay solicitudes {filtro === "TODAS" ? "" : filtro.toLowerCase().replace("_", " ")}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--color-beige)" }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Solicitante</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Motivo</th>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Categoría</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Monto</th>
                    <th className="text-center px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Estado</th>
                    <th className="text-center px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Recibo</th>
                    <th className="text-center px-4 py-3 font-medium" style={{ color: "var(--color-gray)" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--color-beige)" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--color-dark-brown)" }}>
                        {s.personalNombre}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: "var(--color-dark-brown)" }}>
                        {s.motivo}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${categorias[s.categoria]?.color || "#6B7280"}18`,
                                color: categorias[s.categoria]?.color || "#6B7280",
                              }}>
                          {categorias[s.categoria]?.label || s.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium"
                          style={{ color: "var(--color-dark-brown)" }}>
                        {formatoCOP(s.monto)}
                      </td>
                      <td className="px-4 py-3 text-center">{estadoBadge(s.estado)}</td>
                      <td className="px-4 py-3 text-center">
                        {s.fotoPresignedUrl ? (
                          <a href={s.fotoPresignedUrl} target="_blank" rel="noopener noreferrer"
                             className="inline-flex p-1.5 rounded-lg hover:bg-gray-100"
                             style={{ color: "var(--color-gray)" }}>
                            <Eye size={16} />
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: "var(--color-gray)" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {s.estado === "PENDIENTE" && (
                            <>
                              <button onClick={() => handleAprobar(s.id)}
                                      disabled={actionLoading}
                                      className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                      style={{ backgroundColor: "var(--color-green)", color: "#FFF" }}>
                                Aprobar
                              </button>
                              <button onClick={() => { setSelectedId(s.id); setShowRechazar(true); }}
                                      className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                      style={{ backgroundColor: "#FDECEA", color: "var(--color-primary)" }}>
                                Rechazar
                              </button>
                            </>
                          )}
                          {s.estado === "APROBADA" && !s.fechaTransferencia && (
                            <button onClick={() => { setSelectedId(s.id); setShowTransferencia(true); }}
                                    disabled={actionLoading}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                                    style={{ backgroundColor: "#E8F5EE", color: "var(--color-green)" }}>
                              <Upload size={12} />
                              Transferir
                            </button>
                          )}
                          {s.estado === "APROBADA" && s.fechaTransferencia && (
                            <span className="text-xs" style={{ color: "var(--color-green)" }}>
                              <CheckCircle size={14} className="inline mr-1" />
                              Transferido
                            </span>
                          )}
                          {s.comprobanteTransferenciaPresignedUrl && (
                            <a href={s.comprobanteTransferenciaPresignedUrl} target="_blank"
                               rel="noopener noreferrer"
                               className="p-1.5 rounded-lg hover:bg-gray-100"
                               style={{ color: "var(--color-gray)" }}>
                              <ImageIcon size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Modal: Rechazar */}
      {showRechazar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setShowRechazar(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
               onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ color: "var(--color-dark-brown)" }}>Rechazar solicitud</h3>
            <textarea
              value={notaRechazo}
              onChange={(e) => setNotaRechazo(e.target.value)}
              placeholder="Motivo del rechazo (opcional)"
              rows={3}
              className="w-full mt-3 p-3 rounded-xl border text-sm resize-none"
              style={{ borderColor: "var(--color-beige)" }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowRechazar(false)}
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ color: "var(--color-gray)" }}>
                Cancelar
              </button>
              <button onClick={handleRechazar} disabled={actionLoading}
                      className="px-4 py-2 rounded-lg text-sm text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}>
                {actionLoading ? "..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registro de transferencia */}
      {showTransferencia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setShowTransferencia(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
               onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ color: "var(--color-dark-brown)" }}>Registrar transferencia</h3>
            <p className="text-xs mt-1" style={{ color: "var(--color-gray)" }}>
              Adjunte el comprobante de la transferencia bancaria.
            </p>
            <label className="flex flex-col items-center gap-2 mt-3 p-6 rounded-xl border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
                   style={{ borderColor: "var(--color-beige)" }}>
              <Upload size={24} style={{ color: "var(--color-gray)" }} />
              <span className="text-sm" style={{ color: "var(--color-gray)" }}>
                {comprobanteFile ? comprobanteFile.name : "Clic para adjuntar comprobante"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowTransferencia(false); setComprobanteFile(null); }}
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ color: "var(--color-gray)" }}>
                Cancelar
              </button>
              <button onClick={handleTransferencia}
                      disabled={actionLoading || !comprobanteFile}
                      className="px-4 py-2 rounded-lg text-sm text-white"
                      style={{
                        backgroundColor: comprobanteFile ? "var(--color-green)" : "var(--color-gray)",
                      }}>
                {actionLoading ? "..." : "Registrar transferencia"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KpiCard({ icon, label, value, color, isCurrency }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  isCurrency?: boolean;
}) {
  const display = isCurrency
    ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value)
    : value;

  return (
    <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: "var(--color-beige)" }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: "var(--color-dark-brown)" }}>{display}</p>
          <p className="text-xs" style={{ color: "var(--color-gray)" }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function estadoBadge(estado: string) {
  const map: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    PENDIENTE: { bg: "#FFF8E1", color: "#F59E0B", icon: <Clock size={12} /> },
    APROBADA: { bg: "#E8F5EE", color: "var(--color-green)", icon: <CheckCircle size={12} /> },
    RECHAZADA: { bg: "#FDECEA", color: "var(--color-primary)", icon: <XCircle size={12} /> },
  };
  const s = map[estado] ?? { bg: "#F5F5F0", color: "var(--color-gray)", icon: null };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: s.bg, color: s.color }}>
      {s.icon}
      {estado === "PENDIENTE" ? "Pendiente" : estado === "APROBADA" ? "Aprobada" : estado === "RECHAZADA" ? "Rechazada" : estado}
    </span>
  );
}
