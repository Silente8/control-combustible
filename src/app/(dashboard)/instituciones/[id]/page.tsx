import { notFound } from "next/navigation";
import { getInstitucionDetalle } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";
import { formatLitros } from "@/lib/utils";
import Link from "next/link";

export default async function InstitucionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detalle = await getInstitucionDetalle(Number(id));

  if (!detalle) notFound();

  return (
    <div>
      <PageHeader
        title={detalle.nombre}
        description={detalle.tipo ?? "Institución"}
        action={{ label: "Editar", href: `/instituciones/${id}/editar` }}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Consumo total</p>
          <p className="text-xl font-bold text-slate-900">
            {formatLitros(detalle.consumoTotal)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Despachos directos</p>
          <p className="text-xl font-bold text-orange-700">
            {formatLitros(detalle.despachosDirectos)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Vía personas</p>
          <p className="text-xl font-bold text-blue-700">
            {formatLitros(detalle.despachosViaPersonas)}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">Personas de esta institución</h2>
        {detalle.personas.length === 0 ? (
          <p className="text-sm text-slate-500">Sin personas registradas</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {detalle.personas.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-900">{p.nombreCompleto}</p>
                  <p className="text-sm text-slate-500">{p.documentoIdentidad}</p>
                </div>
                <Link href={`/personas/${p.id}/editar`} className="text-sm text-blue-600 hover:underline">
                  Editar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <Link href="/instituciones" className="text-sm text-slate-600 hover:underline">
          ← Volver a instituciones
        </Link>
      </div>
    </div>
  );
}
