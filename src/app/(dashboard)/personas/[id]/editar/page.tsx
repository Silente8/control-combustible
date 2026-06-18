import { notFound } from "next/navigation";
import { getPersonaById, getInstituciones } from "@/lib/actions";
import PersonaForm from "@/components/PersonaForm";

export default async function EditarPersonaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [persona, instituciones] = await Promise.all([
    getPersonaById(Number(id)),
    getInstituciones(),
  ]);

  if (!persona) notFound();

  return <PersonaForm persona={persona} instituciones={instituciones} />;
}
