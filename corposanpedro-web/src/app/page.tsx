"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, setToken } from "@/lib/api";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      if (data.nombre) localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
               style={{ backgroundColor: "var(--color-primary)" }}>
            <span className="text-white text-2xl font-bold">CS</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-dark-brown)" }}>
            CorpoSanpedro
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-gray)" }}>
            Panel de Gestión Operativa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border"
              style={{ borderColor: "var(--color-beige)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm"
                 style={{ backgroundColor: "#FDECEA", color: "var(--color-primary)" }}>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-dark-brown)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm"
              style={{
                borderColor: "var(--color-beige)",
                "--tw-ring-color": "var(--color-primary)",
              } as React.CSSProperties}
              placeholder="admin@corposanpedro.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-dark-brown)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm"
              style={{
                borderColor: "var(--color-beige)",
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)", opacity: loading ? 0.7 : 1 }}
          >
            <LogIn size={18} />
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
