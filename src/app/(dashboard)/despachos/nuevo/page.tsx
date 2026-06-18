import {
  getProductos,
  getPersonas,
  getInstituciones,
  getStockPorProducto,
} from "@/lib/actions";
import DespachoForm from "@/components/DespachoForm";

export default async function NuevoDespachoPage() {
  const [productos, personas, instituciones, stock] = await Promise.all([
    getProductos(),
    getPersonas(),
    getInstituciones(),
    getStockPorProducto(),
  ]);

  return (
    <DespachoForm
      productos={productos}
      personas={personas}
      instituciones={instituciones}
      stock={stock}
    />
  );
}
