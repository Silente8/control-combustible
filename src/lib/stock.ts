import { getDb } from "@/db";
import { productos, entradas, despachos } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function computeStockPorProducto(estacionId?: number) {
  const db = await getDb();
  const allProductos = await db.select().from(productos);
  const result = [];

  for (const producto of allProductos) {
    const entradasCond = estacionId
      ? and(eq(entradas.productoId, producto.id), eq(entradas.estacionId, estacionId))
      : eq(entradas.productoId, producto.id);

    const despachosCond = estacionId
      ? and(eq(despachos.productoId, producto.id), eq(despachos.estacionId, estacionId))
      : eq(despachos.productoId, producto.id);

    const [entradasSum] = await db
      .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
      .from(entradas)
      .where(entradasCond);

    const [despachosSum] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .where(despachosCond);

    const totalEntradas = Number(entradasSum?.total ?? 0);
    const totalDespachos = Number(despachosSum?.total ?? 0);

    result.push({
      producto,
      totalEntradas,
      totalDespachos,
      disponible: totalEntradas - totalDespachos,
    });
  }

  return result;
}
