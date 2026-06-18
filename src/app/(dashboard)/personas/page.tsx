import Link from "next/link";
import { getPersonas } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function PersonasPage() {
  const personas = await getPersonas();

  return (
    <div>
      <PageHeader
        title="Personas"
        description="Personas que reciben despachos de combustible"
        action={{ label: "+ Nueva Persona", href: "/personas/nueva" }}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Nombre</th>
              <th className="pb-3 pr-4 font-medium">Documento</th>
              <th className="pb-3 pr-4 font-medium">Institución</th>
              <th className="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No hay personas.{" "}
                  <Link href="/personas/nueva" className="text-blue-600 hover:underline">
                    Crear la primera
                  </Link>
                </td>
              </tr>
            ) : (
              personas.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">{p.nombreCompleto}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.documentoIdentidad}</td>
                  <td className="py-3 pr-4 text-slate-600">{p.institucionNombre ?? "-"}</td>
                  <td className="py-3">
                    <Link
                      href={`/personas/${p.id}/editar`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
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
