"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

interface Estacion {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
}

export function AdminDespachosToolbar({
  estaciones,
  productos,
  total,
}: {
  estaciones: Estacion[];
  productos: Producto[];
  total: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const estacion = sp.get("estacion") ?? "";
  const desde = sp.get("desde") ?? "";
  const hasta = sp.get("hasta") ?? "";
  const producto = sp.get("producto") ?? "";
  const tipo = sp.get("tipo") ?? "";

  function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, val] of fd.entries()) {
      if (val && String(val).length > 0) params.set(key, String(val));
    }
    router.push(`/admin/despachos?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/despachos");
  }

  const exportParams = new URLSearchParams();
  if (estacion) exportParams.set("estacion", estacion);
  if (desde) exportParams.set("desde", desde);
  if (hasta) exportParams.set("hasta", hasta);
  if (producto) exportParams.set("producto", producto);
  if (tipo) exportParams.set("tipo", tipo);

  return (
    <div className="card mb-6 space-y-4">
      <form onSubmit={applyFilters} className="grid grid-cols-1 gap-3 landscape:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="label" htmlFor="estacion">
            Estación
          </label>
          <select id="estacion" name="estacion" defaultValue={estacion} className="input">
            <option value="">Todas</option>
            {estaciones.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="desde">
            Desde
          </label>
          <input id="desde" name="desde" type="date" defaultValue={desde} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="hasta">
            Hasta
          </label>
          <input id="hasta" name="hasta" type="date" defaultValue={hasta} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="producto">
            Producto
          </label>
          <select id="producto" name="producto" defaultValue={producto} className="input">
            <option value="">Todos</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="tipo">
            Beneficiario
          </label>
          <select id="tipo" name="tipo" defaultValue={tipo} className="input">
            <option value="">Todos</option>
            <option value="persona">Persona</option>
            <option value="institucion">Institución</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary flex-1">
            Filtrar
          </button>
          <button type="button" onClick={clearFilters} className="btn-secondary">
            Limpiar
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{total}</span> despacho
          {total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
        </p>
        <a
          href={`/admin/despachos/export?${exportParams.toString()}`}
          className="btn-primary inline-flex gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar CSV
        </a>
      </div>
    </div>
  );
}
