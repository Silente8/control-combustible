"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDespacho } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatLitros } from "@/lib/utils";

interface Producto {
  id: number;
  nombre: string;
}

interface Persona {
  id: number;
  nombreCompleto: string;
  documentoIdentidad: string;
  institucionNombre: string | null;
}

interface Institucion {
  id: number;
  nombre: string;
}

interface StockItem {
  producto: Producto;
  disponible: number;
}

export default function DespachoForm({
  productos,
  personas,
  instituciones,
  stock,
}: {
  productos: Producto[];
  personas: Persona[];
  instituciones: Institucion[];
  stock: StockItem[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<"persona" | "institucion">("persona");
  const [productoId, setProductoId] = useState(productos[0]?.id ?? 1);

  const disponible = stock.find((s) => s.producto.id === productoId)?.disponible ?? 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await createDespacho({
      fechaHora: form.get("fechaHora") as string,
      productoId: Number(form.get("productoId")),
      litros: Number(form.get("litros")),
      tipoBeneficiario: tipo,
      personaId: tipo === "persona" ? Number(form.get("beneficiarioId")) : undefined,
      institucionId: tipo === "institucion" ? Number(form.get("beneficiarioId")) : undefined,
      observaciones: (form.get("observaciones") as string) || undefined,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/despachos");
      router.refresh();
    }
  }

  const now = new Date();
  const defaultDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Registrar Despacho" description="Combustible despachado (sin cobro)" />

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label" htmlFor="fechaHora">Fecha y hora *</label>
          <input
            id="fechaHora"
            name="fechaHora"
            type="datetime-local"
            required
            defaultValue={defaultDateTime}
            className="input"
          />
        </div>

        <div>
          <label className="label">Despachar a *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={tipo === "persona"}
                onChange={() => setTipo("persona")}
              />
              <span className="text-sm">Persona</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={tipo === "institucion"}
                onChange={() => setTipo("institucion")}
              />
              <span className="text-sm">Institución</span>
            </label>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="beneficiarioId">
            {tipo === "persona" ? "Persona *" : "Institución *"}
          </label>
          <select id="beneficiarioId" name="beneficiarioId" required className="input">
            <option value="">Seleccionar...</option>
            {tipo === "persona"
              ? personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombreCompleto} ({p.documentoIdentidad}) — {p.institucionNombre}
                  </option>
                ))
              : instituciones.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre}
                  </option>
                ))}
          </select>
        </div>

        <div>
          <label className="label">Producto *</label>
          <div className="flex gap-4">
            {productos.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="productoId"
                  value={p.id}
                  checked={productoId === p.id}
                  onChange={() => setProductoId(p.id)}
                  required
                />
                <span className="text-sm">{p.nombre}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Disponible: <strong>{formatLitros(disponible)}</strong>
          </p>
        </div>

        <div>
          <label className="label" htmlFor="litros">Litros *</label>
          <input
            id="litros"
            name="litros"
            type="number"
            step="0.01"
            min="0.01"
            max={disponible}
            required
            placeholder="45.50"
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" rows={2} className="input" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-warning">
            {loading ? "Guardando..." : "Guardar Despacho"}
          </button>
        </div>
      </form>
    </div>
  );
}
