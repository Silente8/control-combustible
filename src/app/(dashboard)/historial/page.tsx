import { getHistorial, getProductos } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatFecha, formatFechaHora, formatLitros, hoyISO } from "@/lib/utils";

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string; tipo?: string; producto?: string }>;
}) {
  const params = await searchParams;
  const productos = await getProductos();

  const desde = params.desde ?? "";
  const hasta = params.hasta ?? hoyISO();
  const tipo = (params.tipo as "entrada" | "despacho" | "todos") || "todos";
  const productoId = params.producto ? Number(params.producto) : undefined;

  const movimientos = await getHistorial({
    desde: desde || undefined,
    hasta: hasta || undefined,
    tipo: tipo === "todos" ? undefined : tipo,
    productoId,
  });

  return (
    <div>
      <PageHeader
        title="Historial de Movimientos"
        description="Entradas y despachos registrados"
      />

      <form className="card mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="label" htmlFor="desde">Desde</label>
          <input id="desde" name="desde" type="date" defaultValue={desde} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="hasta">Hasta</label>
          <input id="hasta" name="hasta" type="date" defaultValue={hasta} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" defaultValue={tipo} className="input">
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="despacho">Despachos</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="producto">Producto</label>
          <select id="producto" name="producto" defaultValue={params.producto ?? ""} className="input">
            <option value="">Todos</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Filtrar
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Tipo</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium">Litros</th>
              <th className="pb-3 pr-4 font-medium">Beneficiario</th>
              <th className="pb-3 font-medium">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No hay movimientos con estos filtros
                </td>
              </tr>
            ) : (
              movimientos.map((m, i) => (
                <tr key={`${m.tipo}-${m.id}-${i}`} className="border-b border-slate-100">
                  <td className="py-3 pr-4">
                    {m.tipo === "entrada" ? formatFecha(m.fecha) : formatFechaHora(m.fecha)}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={m.tipo === "entrada" ? "badge-entrada" : "badge-despacho"}>
                      {m.tipo === "entrada" ? "Entrada" : "Despacho"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{m.producto}</td>
                  <td className="py-3 pr-4 font-medium">{formatLitros(m.litros)}</td>
                  <td className="py-3 pr-4">{m.beneficiario}</td>
                  <td className="py-3">{m.usuario}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
