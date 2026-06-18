import { getProductos } from "@/lib/actions";
import EntradaForm from "@/components/EntradaForm";

export default async function NuevaEntradaPage() {
  const productos = await getProductos();
  return <EntradaForm productos={productos} />;
}
