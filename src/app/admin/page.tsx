import { getAdminDashboardStats, getAdminTopConsumo } from "@/lib/admin-actions";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { EstacionSummaryCard } from "@/components/EstacionSummaryCard";
import { formatLitros } from "@/lib/utils";
import { ZODI_ORGANIZATION } from "@/lib/branding";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats("mes");
  const topConsumo = await getAdminTopConsumo("mes");

  const gasolinaGlobal = stats.stockGlobal.find((s) => s.producto.nombre === "Gasolina");
  const gasoilGlobal = stats.stockGlobal.find((s) => s.producto.nombre === "Gasoil");

  return (
    <div>
      <PageHeader
        title="Panel Administrador"
        description={`${ZODI_ORGANIZATION} — Consolidado de todas las estaciones`}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 landscape:grid-cols-4 lg:gap-4">
        <StatCard
          title="Gasolina total"
          value={gasolinaGlobal?.disponible ?? 0}
          variant="gasolina"
        />
        <StatCard
          title="Gasoil total"
          value={gasoilGlobal?.disponible ?? 0}
          variant="gasoleo"
        />
        <StatCard
          title="Entradas (mes)"
          value={stats.totalEntradasGlobal}
          variant="entrada"
        />
        <StatCard
          title="Despachos (mes)"
          value={stats.totalDespachosGlobal}
          variant="despacho"
        />
      </div>

      <h2 className="mb-4 text-lg font-bold text-slate-900">Por estación de servicio</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 landscape:grid-cols-2">
        {stats.porEstacion.map((item) => {
          const gasolina = item.stock.find((s) => s.producto.nombre === "Gasolina");
          const gasoil = item.stock.find((s) => s.producto.nombre === "Gasoil");
          return (
            <EstacionSummaryCard
              key={item.estacion.id}
              estacionId={item.estacion.id}
              nombre={item.estacion.nombre}
              totalEntradas={item.totalEntradas}
              totalDespachos={item.totalDespachos}
              gasolina={gasolina?.disponible ?? 0}
              gasoil={gasoil?.disponible ?? 0}
            />
          );
        })}
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Top consumo por institución (mes)
        </h2>
        {topConsumo.length === 0 ? (
          <p className="text-sm text-slate-500">Sin despachos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Estación</th>
                  <th className="pb-3 pr-4 font-medium">Institución</th>
                  <th className="pb-3 font-medium">Litros</th>
                </tr>
              </thead>
              <tbody>
                {topConsumo.map((row, i) => (
                  <tr key={`${row.estacion}-${row.nombre}-${i}`} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">{row.estacion}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">{row.nombre}</td>
                    <td className="py-3 font-semibold text-orange-700">
                      {formatLitros(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Stock global por producto</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">Producto</th>
                <th className="pb-3 pr-4 font-medium">Entradas</th>
                <th className="pb-3 pr-4 font-medium">Despachos</th>
                <th className="pb-3 font-medium">Disponible</th>
              </tr>
            </thead>
            <tbody>
              {stats.stockGlobal.map((item) => (
                <tr key={item.producto.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{item.producto.nombre}</td>
                  <td className="py-3 pr-4 text-green-700">
                    {formatLitros(item.totalEntradas)}
                  </td>
                  <td className="py-3 pr-4 text-orange-700">
                    {formatLitros(item.totalDespachos)}
                  </td>
                  <td className="py-3 font-semibold">{formatLitros(item.disponible)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
