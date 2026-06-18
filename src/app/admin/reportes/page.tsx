import { getAdminDashboardStats } from "@/lib/admin-actions";
import { PageHeader } from "@/components/PageHeader";
import { formatLitros } from "@/lib/utils";

export default async function AdminReportesPage() {
  const stats = await getAdminDashboardStats("mes");

  return (
    <div>
      <PageHeader
        title="Reportes consolidados"
        description="Comparativa del mes actual entre estaciones"
      />

      <div className="grid grid-cols-1 gap-6 landscape:grid-cols-2">
        {stats.porEstacion.map((item) => (
          <div key={item.estacion.id} className="card">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              {item.estacion.nombre}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg bg-green-50 px-4 py-3">
                <span className="text-sm text-green-800">Entradas del mes</span>
                <span className="font-bold text-green-900">
                  {formatLitros(item.totalEntradas)}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-orange-50 px-4 py-3">
                <span className="text-sm text-orange-800">Despachos del mes</span>
                <span className="font-bold text-orange-900">
                  {formatLitros(item.totalDespachos)}
                </span>
              </div>
              {item.stock.map((s) => (
                <div
                  key={s.producto.id}
                  className="flex justify-between border-b border-slate-100 pb-2 text-sm"
                >
                  <span className="text-slate-600">{s.producto.nombre} disponible</span>
                  <span className="font-semibold text-slate-900">
                    {formatLitros(s.disponible)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Totales generales</h2>
        <div className="grid grid-cols-2 gap-4 landscape:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <p className="text-xs font-medium text-blue-700">Entradas totales</p>
            <p className="mt-1 text-xl font-bold text-blue-900">
              {formatLitros(stats.totalEntradasGlobal)}
            </p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 text-center">
            <p className="text-xs font-medium text-orange-700">Despachos totales</p>
            <p className="mt-1 text-xl font-bold text-orange-900">
              {formatLitros(stats.totalDespachosGlobal)}
            </p>
          </div>
          {stats.stockGlobal.map((s) => (
            <div key={s.producto.id} className="rounded-xl bg-slate-100 p-4 text-center">
              <p className="text-xs font-medium text-slate-600">{s.producto.nombre}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatLitros(s.disponible)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
