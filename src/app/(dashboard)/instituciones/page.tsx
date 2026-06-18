import Link from "next/link";
import { getInstituciones } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function InstitucionesPage() {
  const instituciones = await getInstituciones();

  return (
    <div>
      <PageHeader
        title="Instituciones"
        description="Organizaciones que reciben combustible"
        action={{ label: "+ Nueva Institución", href: "/instituciones/nueva" }}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Nombre</th>
              <th className="pb-3 pr-4 font-medium">Tipo</th>
              <th className="pb-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instituciones.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No hay instituciones.{" "}
                  <Link href="/instituciones/nueva" className="text-blue-600 hover:underline">
                    Crear la primera
                  </Link>
                </td>
              </tr>
            ) : (
              instituciones.map((inst) => (
                <tr key={inst.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">{inst.nombre}</td>
                  <td className="py-3 pr-4 text-slate-600">{inst.tipo ?? "-"}</td>
                  <td className="py-3">
                    <Link
                      href={`/instituciones/${inst.id}`}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/instituciones/${inst.id}/editar`}
                      className="text-slate-600 hover:underline"
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
