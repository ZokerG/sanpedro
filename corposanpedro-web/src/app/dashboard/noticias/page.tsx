"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  fetchNoticias, crearNoticia, actualizarNoticia, eliminarNoticia,
  setToken, NoticiaResponse,
} from "@/lib/api";
import {
  RefreshCw, Plus, X, Image as ImageIcon, Star, Trash2, Edit,
  Megaphone, Pin,
} from "lucide-react";

export default function NoticiasPage() {
  const router = useRouter();
  const [noticias, setNoticias] = useState<NoticiaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [planta, setPlanta] = useState("");
  const [destacada, setDestacada] = useState(false);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedNoticia, setSelectedNoticia] = useState<NoticiaResponse | null>(null);
  const [usuario, setUsuario] = useState<{ id: number; nombre: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError("");
      const data = await fetchNoticias();
      setNoticias(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Sesión expirada") return;
      setError(err instanceof Error ? err.message : "Error al cargar noticias");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) { router.push("/"); return; }
    setToken(stored);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUsuario(user);
    loadData();
  }, [router, loadData]);

  function resetForm() {
    setTitulo("");
    setContenido("");
    setPlanta("");
    setDestacada(false);
    setImagenFile(null);
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(noticia: NoticiaResponse) {
    setEditId(noticia.id);
    setTitulo(noticia.titulo);
    setContenido(noticia.contenido);
    setPlanta(noticia.planta || "");
    setDestacada(noticia.destacada);
    setImagenFile(null);
    setShowForm(true);
  }

  async function handleSubmit() {
    if (!titulo.trim() || !contenido.trim()) return;
    setActionLoading(true);
    try {
      const fd = new FormData();
      fd.append("noticia", new Blob([JSON.stringify({
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        planta: planta.trim() || null,
        destacada,
      })], { type: "application/json" }));
      fd.append("autorId", String(usuario?.id || 1));
      if (imagenFile) fd.append("imagen", imagenFile);

      if (editId) {
        await actualizarNoticia(editId, fd);
      } else {
        await crearNoticia(fd);
      }
      resetForm();
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Eliminar esta noticia?")) return;
    try {
      await eliminarNoticia(id);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  }

  const formatoFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-CO", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-xl" style={{ color: "var(--color-dark-brown)" }}>Noticias y Anuncios</h2>
          <p className="text-xs mt-1" style={{ color: "var(--color-gray)" }}>Comunicados del gerente para las plantas</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-gray-50"
                  style={{ color: "var(--color-gray)" }}>
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Plus size={16} />
            Nueva Noticia
          </button>
        </div>
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

      {!loading && noticias.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center"
             style={{ borderColor: "var(--color-beige)" }}>
          <Megaphone size={48} style={{ color: "var(--color-beige)", margin: "0 auto 16px" }} />
          <p className="font-medium" style={{ color: "var(--color-dark-brown)" }}>No hay noticias publicadas</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-gray)" }}>
            Publica el primer anuncio para mantener informado al equipo
          </p>
        </div>
      )}

      {!loading && noticias.length > 0 && (
        <div className="space-y-4">
          {noticias.map((n) => (
            <div key={n.id}
                 className="bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
                 style={{ borderColor: n.destacada ? "var(--color-gold)" : "var(--color-beige)" }}
                 onClick={() => setSelectedNoticia(n)}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {n.destacada && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#FFF8E1", color: "#F59E0B" }}>
                          <Pin size={10} />
                          Destacada
                        </span>
                      )}
                      {n.planta && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#E8F0FE", color: "#3B82F6" }}>
                          {n.planta}
                        </span>
                      )}
                      {!n.planta && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#F0EDE8", color: "var(--color-gray)" }}>
                          General
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold" style={{ color: "var(--color-dark-brown)" }}>
                      {n.titulo}
                    </h3>
                    <p className="text-sm mt-2 line-clamp-3" style={{ color: "var(--color-gray)" }}>
                      {n.contenido}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs" style={{ color: "var(--color-gray)" }}>
                        {n.autorNombre}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-gray)" }}>
                        {formatoFecha(n.fechaPublicacion)}
                      </span>
                    </div>
                  </div>
                  {n.imagenPresignedUrl && (
                    <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                      <img src={n.imagenPresignedUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t"
                     style={{ borderColor: "var(--color-beige)" }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(n); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                    style={{ color: "var(--color-gray)" }}
                  >
                    <Edit size={12} />
                    Editar
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <Trash2 size={12} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
             onClick={() => resetForm()}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "var(--color-dark-brown)" }}>
                {editId ? "Editar noticia" : "Nueva noticia"}
              </h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-50"
                      style={{ color: "var(--color-gray)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-dark-brown)" }}>
                  Título
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título del anuncio"
                  className="w-full p-3 rounded-xl border text-sm"
                  style={{ borderColor: "var(--color-beige)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-dark-brown)" }}>
                  Contenido
                </label>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder="Escribe el contenido del anuncio..."
                  rows={4}
                  className="w-full p-3 rounded-xl border text-sm resize-none"
                  style={{ borderColor: "var(--color-beige)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-dark-brown)" }}>
                    Planta (opcional)
                  </label>
                  <input
                    type="text"
                    value={planta}
                    onChange={(e) => setPlanta(e.target.value)}
                    placeholder="Ej: Norte, Sur..."
                    className="w-full p-3 rounded-xl border text-sm"
                    style={{ borderColor: "var(--color-beige)" }}
                  />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={destacada}
                      onChange={(e) => setDestacada(e.target.checked)}
                      className="w-4 h-4 rounded accent-[var(--color-gold)]"
                    />
                    <span className="flex items-center gap-1 text-sm font-medium"
                          style={{ color: "var(--color-dark-brown)" }}>
                      <Star size={14} style={{ color: "var(--color-gold)" }} />
                      Destacada
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
                       style={{ borderColor: "var(--color-beige)" }}>
                  <ImageIcon size={24} style={{ color: "var(--color-gray)" }} />
                  <span className="text-sm" style={{ color: "var(--color-gray)" }}>
                    {imagenFile ? imagenFile.name : "Imagen (opcional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg text-sm"
                      style={{ color: "var(--color-gray)" }}>
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={actionLoading || !titulo.trim() || !contenido.trim()}
                className="px-4 py-2 rounded-lg text-sm text-white transition-colors"
                style={{
                  backgroundColor: titulo.trim() && contenido.trim() ? "var(--color-primary)" : "var(--color-gray)",
                }}
              >
                {actionLoading ? "..." : editId ? "Guardar cambios" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail */}
      {selectedNoticia && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
             onClick={() => setSelectedNoticia(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedNoticia.destacada && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FFF8E1", color: "#F59E0B" }}>
                    <Pin size={10} /> Destacada
                  </span>
                )}
                {selectedNoticia.planta && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#E8F0FE", color: "#3B82F6" }}>
                    {selectedNoticia.planta}
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedNoticia(null)} className="p-1 rounded-lg hover:bg-gray-50"
                      style={{ color: "var(--color-gray)" }}>
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-dark-brown)" }}>
              {selectedNoticia.titulo}
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm" style={{ color: "var(--color-gray)" }}>
                {selectedNoticia.autorNombre}
              </span>
              <span className="text-xs" style={{ color: "var(--color-gray)" }}>
                {formatoFecha(selectedNoticia.fechaPublicacion)}
              </span>
            </div>

            {selectedNoticia.imagenPresignedUrl && (
              <img
                src={selectedNoticia.imagenPresignedUrl}
                alt={selectedNoticia.titulo}
                className="w-full rounded-xl mb-6 object-cover max-h-80"
              />
            )}

            <p className="text-sm leading-relaxed whitespace-pre-wrap"
               style={{ color: "var(--color-dark-brown)" }}>
              {selectedNoticia.contenido}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
