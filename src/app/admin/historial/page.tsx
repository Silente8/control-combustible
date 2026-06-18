import { getAdminHistorial, getEstaciones } from "@/lib/admin-actions";
import { PageHeader } from "@/components/PageHeader";
import { formatFecha, formatLitros } from "@/lib/utils";

export default async function AdminHistorialPage() {
  const [movimientos, estaciones] = await Promise.all([
    getAdminHistorial({ tipo: "todos" }),
    getEstaciones(),
  ]);

  return (
    <div>
      <PageHeader
        title="Historial global"
        description={`Movimientos de ${estaciones.map((e) => e.nombre).join(" y ")}`}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Fecha</th>
              <th className="pb-3 pr-4 font-medium">Estación</th>
              <th className="pb-3 pr-4 font-medium">Tipo</th>
              <th className="pb-3 pr-4 font-medium">Producto</th>
              <th className="pb-3 pr-4 font-medium">Litros</th>
              <th className="pb-3 pr-4 font-medium">Beneficiario</th>
              <th className="pb-3 font-medium">Operador</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No hay movimientos registrados
                </td>
              </tr>
            ) : (
              movimientos.map((m) => (
                <tr key={`${m.tipo}-${m.id}`} className="border-b border-slate-100">
                  <td className="py-3 pr-4 whitespace-nowrap">{formatFecha(m.fecha)}</td>
                  <td className="py-3 pr-4 font-medium text-blue-700">{m.estacion}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        m.tipo === "entrada" ? "badge-entrada" : "badge-despacho"
                      }
                    >
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
