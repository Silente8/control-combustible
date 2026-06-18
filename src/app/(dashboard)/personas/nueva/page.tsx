import { getInstituciones } from "@/lib/actions";
import PersonaForm from "@/components/PersonaForm";

export default async function NuevaPersonaPage() {
  const instituciones = await getInstituciones();
  return <PersonaForm instituciones={instituciones} />;
}
