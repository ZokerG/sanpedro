const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

let token: string | null = null;

export function setToken(t: string | null) {
  token = t;
}

export function getToken(): string | null {
  return token;
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    throw new Error("Sesión expirada");
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  const data = JSON.parse(text);

  if (!res.ok) {
    throw new Error(data.message || data.error || `Error ${res.status}`);
  }

  return data;
}

export const api = {
  post: (path: string, body: unknown) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  get: (path: string) => request(path),
  patch: (path: string, body: unknown) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path: string) => request(path, { method: "DELETE" }),
};

// Auth
export async function login(email: string, password: string) {
  const data = await api.post("/auth/login", { correo: email, contrasena: password });
  if (data.token) setToken(data.token);
  return data;
}

// Dashboard
export async function fetchDashboardOperativo() {
  return api.get("/dashboard/operativo");
}

// ─── Finanzas: Solicitudes de Compra ──────────────────────────────────────

export interface SolicitudCompraResponse {
  id: number;
  personalId: number;
  personalNombre: string;
  motivo: string;
  monto: number;
  categoria: "TRANSPORTE" | "INSUMOS" | "ALIMENTACION" | "OTROS";
  fotoPresignedUrl: string | null;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  aprobadorId: number | null;
  aprobadorNombre: string | null;
  fechaAprobacion: string | null;
  comprobanteTransferenciaPresignedUrl: string | null;
  fechaTransferencia: string | null;
  notaRechazo: string | null;
  createdAt: string;
}

export async function fetchSolicitudesCompra(): Promise<SolicitudCompraResponse[]> {
  return api.get("/solicitudes-compra");
}

export async function fetchSolicitudesPendientes(): Promise<SolicitudCompraResponse[]> {
  return api.get("/solicitudes-compra/pendientes");
}

export async function aprobarSolicitud(id: number, aprobadorId: number): Promise<SolicitudCompraResponse> {
  return api.patch(`/solicitudes-compra/${id}/aprobar?aprobadorId=${aprobadorId}`, {});
}

export async function rechazarSolicitud(id: number, nota?: string): Promise<SolicitudCompraResponse> {
  const query = nota ? `?nota=${encodeURIComponent(nota)}` : "";
  return api.patch(`/solicitudes-compra/${id}/rechazar${query}`, {});
}

export async function crearSolicitudCompra(formData: FormData): Promise<SolicitudCompraResponse> {
  return requestMultipart("/solicitudes-compra", "POST", formData);
}

export async function registrarTransferencia(id: number, formData: FormData): Promise<SolicitudCompraResponse> {
  return requestMultipart(`/solicitudes-compra/${id}/transferencia`, "POST", formData);
}

// ─── Noticias ──────────────────────────────────────────────────────────────

export interface NoticiaResponse {
  id: number;
  autorNombre: string;
  titulo: string;
  contenido: string;
  planta: string | null;
  destacada: boolean;
  fechaPublicacion: string;
  imagenPresignedUrl: string | null;
  createdAt: string | null;
}

export async function fetchNoticias(): Promise<NoticiaResponse[]> {
  return api.get("/noticias");
}

export async function fetchNoticiasDestacadas(): Promise<NoticiaResponse[]> {
  return api.get("/noticias/destacadas");
}

export async function fetchNoticiasPorPlanta(planta: string): Promise<NoticiaResponse[]> {
  return api.get(`/noticias/planta/${encodeURIComponent(planta)}`);
}

export async function crearNoticia(formData: FormData): Promise<NoticiaResponse> {
  return requestMultipart("/noticias", "POST", formData);
}

export async function actualizarNoticia(id: number, formData: FormData): Promise<NoticiaResponse> {
  return requestMultipart(`/noticias/${id}`, "PUT", formData);
}

export async function eliminarNoticia(id: number): Promise<void> {
  return api.del(`/noticias/${id}`);
}

// ─── Multipart ─────────────────────────────────────────────────────────────

async function requestMultipart(path: string, method: string, formData: FormData) {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: formData });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    throw new Error("Sesión expirada");
  }

  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  const data = JSON.parse(text);
  if (!res.ok) {
    throw new Error(data.message || data.error || `Error ${res.status}`);
  }

  return data;
}
