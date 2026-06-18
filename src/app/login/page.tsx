"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AppBrand } from "@/components/AppBrand";
import { ZODI_ORGANIZATION } from "@/lib/branding";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const paramError = searchParams.get("error");
  const errorMsg =
    paramError === "sin-perfil"
      ? "Usuario no configurado. Contacte al administrador."
      : paramError === "sin-estacion"
        ? "Operador sin estación asignada."
        : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    router.push("/auth/entry");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <AppBrand variant="login" />

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 shadow-md">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">Iniciar sesión</h2>
            <p className="mt-1 text-xs text-slate-500">{ZODI_ORGANIZATION}</p>
          </div>

          {(error || errorMsg) && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error || errorMsg}
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input py-3 text-base"
              placeholder="operador@zodi46-yaracuy.com"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input py-3 text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base font-semibold"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
