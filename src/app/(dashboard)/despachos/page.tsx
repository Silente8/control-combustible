import { getHistorial } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatFechaHora, formatLitros } from "@/lib/utils";
import Link from "next/link";

export default async function DespachosPage() {
  const movimientos = await getHistorial({ tipo: "despacho" });

  return (
    <div>
      <PageHeader
        title="Despachos"
        description="Combustible despachado a personas e instituciones"
        action={{ label: "+ Nuevo Despacho", href: "/despachos/nuevo", variant: "warning" }}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium">Litros</th>
              <th className="pb-3 pr-4 font-medium">Beneficiario</th>
              <th className="pb-3 font-medium">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No hay despachos registrados.{" "}
                  <Link href="/despachos/nuevo" className="text-blue-600 hover:underline">
                    Registrar el primero
                  </Link>
                </td>
              </tr>
            ) : (
              movimientos.map((m) => (
                <tr key={m.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{formatFechaHora(m.fecha)}</td>
                  <td className="py-3 pr-4">{m.producto}</td>
                  <td className="py-3 pr-4 font-medium text-orange-700">
                    {formatLitros(m.litros)}
                  </td>
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
