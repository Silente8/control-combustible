import { notFound } from "next/navigation";
import { getInstitucionById } from "@/lib/actions";
import InstitucionForm from "@/components/InstitucionForm";

export default async function EditarInstitucionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const institucion = await getInstitucionById(Number(id));

  if (!institucion) notFound();

  return <InstitucionForm institucion={institucion} />;
}
