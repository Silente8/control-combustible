"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEntrada } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { hoyISO } from "@/lib/utils";

interface Producto {
  id: number;
  nombre: string;
}

export default function EntradaForm({
  productos,
}: {
  productos: Producto[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await createEntrada({
      fecha: form.get("fecha") as string,
      productoId: Number(form.get("productoId")),
      litros: Number(form.get("litros")),
      proveedor: (form.get("proveedor") as string) || undefined,
      numeroDocumento: (form.get("numeroDocumento") as string) || undefined,
      observaciones: (form.get("observaciones") as string) || undefined,
    });

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/entradas");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Registrar Entrada" description="Combustible recibido en la estación" />

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label" htmlFor="fecha">Fecha *</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={hoyISO()}
            className="input"
          />
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
                  defaultChecked={p.nombre === "Gasolina"}
                  required
                />
                <span className="text-sm">{p.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="litros">Litros *</label>
          <input
            id="litros"
            name="litros"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="5000.00"
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="proveedor">Proveedor</label>
          <input id="proveedor" name="proveedor" type="text" className="input" />
        </div>

        <div>
          <label className="label" htmlFor="numeroDocumento">N° Documento</label>
          <input id="numeroDocumento" name="numeroDocumento" type="text" className="input" />
        </div>

        <div>
          <label className="label" htmlFor="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" rows={2} className="input" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-success">
            {loading ? "Guardando..." : "Guardar Entrada"}
          </button>
        </div>
      </form>
    </div>
  );
}
