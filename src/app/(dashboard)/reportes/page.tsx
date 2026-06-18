import { getReporteResumen } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatLitros, hoyISO } from "@/lib/utils";

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: string; hasta?: string }>;
}) {
  const params = await searchParams;
  const desde = params.desde ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const hasta = params.hasta ?? hoyISO();

  const { resumen, consumoPorInstitucion } = await getReporteResumen(desde, hasta);

  const maxConsumo = Math.max(...consumoPorInstitucion.map((i) => i.total), 1);

  return (
    <div>
      <PageHeader
        title="Reportes"
        description="Estadísticas de entradas, despachos y consumo"
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
        <button type="submit" className="btn-primary">
          Generar reporte
        </button>
      </form>

      <div className="mb-6 card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Resumen del periodo</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">Producto</th>
                <th className="pb-3 pr-4 font-medium">Entradas</th>
                <th className="pb-3 pr-4 font-medium">Despachos</th>
                <th className="pb-3 font-medium">Saldo actual</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((r) => (
                <tr key={r.producto} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{r.producto}</td>
                  <td className="py-3 pr-4 text-green-700">{formatLitros(r.entradas)}</td>
                  <td className="py-3 pr-4 text-orange-700">{formatLitros(r.despachos)}</td>
                  <td className="py-3 font-semibold">{formatLitros(r.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Consumo por institución
        </h2>
        {consumoPorInstitucion.length === 0 ? (
          <p className="text-sm text-slate-500">Sin consumo en el periodo seleccionado</p>
        ) : (
          <ul className="space-y-4">
            {consumoPorInstitucion.map((inst) => (
              <li key={inst.nombre}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{inst.nombre}</span>
                  <span className="font-semibold text-slate-900">{formatLitros(inst.total)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(inst.total / maxConsumo) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Directo: {formatLitros(inst.directo)} · Vía personas: {formatLitros(inst.viaPersonas)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
