import Link from "next/link";
import { getDashboardStats } from "@/lib/actions";
import { requireOperador } from "@/lib/auth";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { formatLitros } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export default async function DashboardPage() {
  const ctx = await requireOperador();
  const stats = await getDashboardStats("mes");

  const gasolina = stats.stock.find((s) => s.producto.nombre === "Gasolina");
  const gasoleo = stats.stock.find((s) => s.producto.nombre === "Gasoil");

  return (
    <div>
      <PageHeader
        title="Panel de Control"
        description={`Estación ${ctx.estacionNombre} — resumen del mes actual`}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 landscape:grid-cols-4 lg:gap-4">
        <StatCard
          title="Gasolina disponible"
          value={gasolina?.disponible ?? 0}
          variant="gasolina"
        />
        <StatCard
          title="Gasoil disponible"
          value={gasoleo?.disponible ?? 0}
          variant="gasoleo"
        />
        <StatCard
          title="Entradas del mes"
          value={stats.totalEntradas}
          variant="entrada"
        />
        <StatCard
          title="Despachos del mes"
          value={stats.totalDespachos}
          variant="despacho"
        />
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/entradas/nueva"
          className="btn-success flex-1 py-4 text-base font-semibold landscape:py-3"
        >
          <ArrowDownToLine className="h-6 w-6" />
          Registrar Entrada
        </Link>
        <Link
          href="/despachos/nuevo"
          className="btn-warning flex-1 py-4 text-base font-semibold landscape:py-3"
        >
          <ArrowUpFromLine className="h-6 w-6" />
          Registrar Despacho
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 landscape:grid-cols-2 lg:grid-cols-2 lg:gap-6">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Top Instituciones (mes)
          </h2>
          {stats.topInstituciones.length === 0 ? (
            <p className="text-sm text-slate-500">Sin despachos registrados</p>
          ) : (
            <ul className="space-y-3">
              {stats.topInstituciones.map((item, i) => (
                <li key={item.nombre} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">{item.nombre}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatLitros(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Top Personas (mes)
          </h2>
          {stats.topPersonas.length === 0 ? (
            <p className="text-sm text-slate-500">Sin despachos registrados</p>
          ) : (
            <ul className="space-y-3">
              {stats.topPersonas.map((item, i) => (
                <li key={item.nombre} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">{item.nombre}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatLitros(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Stock por producto</h2>
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
              {stats.stock.map((item) => (
                <tr key={item.producto.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {item.producto.nombre}
                  </td>
                  <td className="py-3 pr-4 text-green-700">
                    {formatLitros(item.totalEntradas)}
                  </td>
                  <td className="py-3 pr-4 text-orange-700">
                    {formatLitros(item.totalDespachos)}
                  </td>
                  <td className="py-3 font-semibold text-slate-900">
                    {formatLitros(item.disponible)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
