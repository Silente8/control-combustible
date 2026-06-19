import { Suspense } from "react";
import {
  getAdminDespachosDetalle,
  getEstaciones,
  getProductosList,
} from "@/lib/admin-actions";
import { PageHeader } from "@/components/PageHeader";
import { AdminDespachosToolbar } from "@/components/AdminDespachosToolbar";
import { formatFechaHora, formatLitros } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    estacion?: string;
    desde?: string;
    hasta?: string;
    producto?: string;
    tipo?: string;
  }>;
}

export default async function AdminDespachosPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const estacionId = sp.estacion ? Number(sp.estacion) : undefined;
  const productoId = sp.producto ? Number(sp.producto) : undefined;
  const tipo = sp.tipo as "persona" | "institucion" | undefined;

  const [estaciones, productos, despachos] = await Promise.all([
    getEstaciones(),
    getProductosList(),
    getAdminDespachosDetalle({
      estacionId,
      desde: sp.desde,
      hasta: sp.hasta,
      productoId,
      tipoBeneficiario: tipo,
    }),
  ]);

  const estacionNombre = estacionId
    ? estaciones.find((e) => e.id === estacionId)?.nombre
    : null;

  return (
    <div>
      <PageHeader
        title="Detalle de despachos"
        description={
          estacionNombre
            ? `Apoyos registrados — Estación ${estacionNombre}`
            : "Apoyos registrados — Todas las estaciones"
        }
      />

      <Suspense>
        <AdminDespachosToolbar
          estaciones={estaciones}
          productos={productos}
          total={despachos.length}
        />
      </Suspense>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Estación</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium">Litros</th>
              <th className="pb-3 pr-4 font-medium">Tipo</th>
              <th className="pb-3 pr-4 font-medium">Beneficiario</th>
              <th className="pb-3 pr-4 font-medium">Operador</th>
              <th className="pb-3 font-medium">Obs.</th>
            </tr>
          </thead>
          <tbody>
            {despachos.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
                  No hay despachos con estos filtros
                </td>
              </tr>
            ) : (
              despachos.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {formatFechaHora(d.fechaHora)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-blue-700">{d.estacion}</td>
                  <td className="py-3 pr-4">{d.producto}</td>
                  <td className="py-3 pr-4 font-semibold text-orange-700">
                    {formatLitros(d.litros)}
                  </td>
                  <td className="py-3 pr-4">{d.tipoBeneficiario}</td>
                  <td className="py-3 pr-4">{d.beneficiario}</td>
                  <td className="py-3 pr-4 text-slate-600">{d.operador}</td>
                  <td className="py-3 max-w-[120px] truncate text-slate-500" title={d.observaciones}>
                    {d.observaciones || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
