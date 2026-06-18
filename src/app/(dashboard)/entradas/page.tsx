import { getHistorial } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatFecha, formatLitros } from "@/lib/utils";
import Link from "next/link";

export default async function EntradasPage() {
  const movimientos = await getHistorial({ tipo: "entrada" });

  return (
    <div>
      <PageHeader
        title="Entradas de Combustible"
        description="Registro de combustible recibido"
        action={{ label: "+ Nueva Entrada", href: "/entradas/nueva", variant: "success" }}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium">Litros</th>
              <th className="pb-3 font-medium">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No hay entradas registradas.{" "}
                  <Link href="/entradas/nueva" className="text-blue-600 hover:underline">
                    Registrar la primera
                  </Link>
                </td>
              </tr>
            ) : (
              movimientos.map((m) => (
                <tr key={m.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{formatFecha(m.fecha)}</td>
                  <td className="py-3 pr-4">{m.producto}</td>
                  <td className="py-3 pr-4 font-medium text-green-700">
                    {formatLitros(m.litros)}
                  </td>
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
