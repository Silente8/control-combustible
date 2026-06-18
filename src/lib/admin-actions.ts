"use server";

import { getDb } from "@/db";
import {
  productos,
  instituciones,
  personas,
  entradas,
  despachos,
  estaciones,
} from "@/db/schema";
import { eq, sql, and, gte, lte, desc } from "drizzle-orm";
import { getRangoPeriodo, type Periodo } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";
import { computeStockPorProducto } from "@/lib/stock";

function filtroFecha(
  campo: typeof entradas.fecha | typeof despachos.fechaHora,
  desde?: string,
  hasta?: string
) {
  const condiciones = [];
  if (desde) condiciones.push(gte(campo, desde));
  if (hasta) {
    const hastaFin = hasta.length <= 10 ? `${hasta}T23:59:59` : hasta;
    condiciones.push(lte(campo, hastaFin));
  }
  return condiciones.length > 0 ? and(...condiciones) : undefined;
}

export async function getEstaciones() {
  await requireAdmin();
  const db = await getDb();
  return db.select().from(estaciones).where(eq(estaciones.activa, 1));
}

export async function getAdminDashboardStats(periodo: Periodo = "mes") {
  await requireAdmin();
  const db = await getDb();
  const allEstaciones = await getEstaciones();
  const rango = getRangoPeriodo(periodo);
  const desde = rango?.desde;
  const hasta = rango?.hasta;
  const entradasFiltro = filtroFecha(entradas.fecha, desde, hasta);
  const despachosFiltro = filtroFecha(despachos.fechaHora, desde, hasta);

  const porEstacion = [];

  for (const est of allEstaciones) {
    const stock = await computeStockPorProducto(est.id);

    const [totalEntradas] = await db
      .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
      .from(entradas)
      .where(
        and(eq(entradas.estacionId, est.id), entradasFiltro ?? sql`true`)
      );

    const [totalDespachos] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .where(
        and(eq(despachos.estacionId, est.id), despachosFiltro ?? sql`true`)
      );

    porEstacion.push({
      estacion: est,
      stock,
      totalEntradas: Number(totalEntradas?.total ?? 0),
      totalDespachos: Number(totalDespachos?.total ?? 0),
    });
  }

  const stockGlobal = await computeStockPorProducto();

  const [entradasGlobal] = await db
    .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
    .from(entradas)
    .where(entradasFiltro ?? sql`true`);

  const [despachosGlobal] = await db
    .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
    .from(despachos)
    .where(despachosFiltro ?? sql`true`);

  return {
    porEstacion,
    stockGlobal,
    totalEntradasGlobal: Number(entradasGlobal?.total ?? 0),
    totalDespachosGlobal: Number(despachosGlobal?.total ?? 0),
  };
}

export async function getAdminHistorial(filtros?: {
  estacionId?: number;
  desde?: string;
  hasta?: string;
  tipo?: "entrada" | "despacho" | "todos";
}) {
  await requireAdmin();
  const db = await getDb();
  const movimientos: Array<{
    id: number;
    fecha: string;
    tipo: "entrada" | "despacho";
    estacion: string;
    producto: string;
    litros: number;
    beneficiario: string;
    usuario: string;
  }> = [];

  const estacionFilter = filtros?.estacionId
    ? eq(entradas.estacionId, filtros.estacionId)
    : undefined;
  const despEstacionFilter = filtros?.estacionId
    ? eq(despachos.estacionId, filtros.estacionId)
    : undefined;

  if (!filtros?.tipo || filtros.tipo === "entrada" || filtros.tipo === "todos") {
    const condiciones = [];
    if (estacionFilter) condiciones.push(estacionFilter);
    if (filtros?.desde) condiciones.push(gte(entradas.fecha, filtros.desde));
    if (filtros?.hasta) condiciones.push(lte(entradas.fecha, filtros.hasta));

    const rows = await db
      .select({
        id: entradas.id,
        fecha: entradas.fecha,
        litros: entradas.litros,
        usuario: entradas.usuarioRegistro,
        producto: productos.nombre,
        estacion: estaciones.nombre,
      })
      .from(entradas)
      .innerJoin(productos, eq(entradas.productoId, productos.id))
      .innerJoin(estaciones, eq(entradas.estacionId, estaciones.id))
      .where(condiciones.length > 0 ? and(...condiciones) : undefined);

    for (const row of rows) {
      movimientos.push({
        id: row.id,
        fecha: row.fecha,
        tipo: "entrada",
        estacion: row.estacion,
        producto: row.producto,
        litros: row.litros,
        beneficiario: "-",
        usuario: row.usuario,
      });
    }
  }

  if (!filtros?.tipo || filtros.tipo === "despacho" || filtros.tipo === "todos") {
    const condiciones = [];
    if (despEstacionFilter) condiciones.push(despEstacionFilter);
    if (filtros?.desde) condiciones.push(gte(despachos.fechaHora, filtros.desde));
    if (filtros?.hasta)
      condiciones.push(lte(despachos.fechaHora, `${filtros.hasta}T23:59:59`));

    const rows = await db
      .select({
        id: despachos.id,
        fecha: despachos.fechaHora,
        litros: despachos.litros,
        usuario: despachos.usuarioRegistro,
        producto: productos.nombre,
        estacion: estaciones.nombre,
        tipoBeneficiario: despachos.tipoBeneficiario,
        personaNombre: personas.nombreCompleto,
        institucionNombre: instituciones.nombre,
      })
      .from(despachos)
      .innerJoin(productos, eq(despachos.productoId, productos.id))
      .innerJoin(estaciones, eq(despachos.estacionId, estaciones.id))
      .leftJoin(personas, eq(despachos.personaId, personas.id))
      .leftJoin(instituciones, eq(despachos.institucionId, instituciones.id))
      .where(condiciones.length > 0 ? and(...condiciones) : undefined);

    for (const row of rows) {
      movimientos.push({
        id: row.id,
        fecha: row.fecha,
        tipo: "despacho",
        estacion: row.estacion,
        producto: row.producto,
        litros: row.litros,
        beneficiario:
          row.tipoBeneficiario === "persona"
            ? row.personaNombre ?? "-"
            : row.institucionNombre ?? "-",
        usuario: row.usuario,
      });
    }
  }

  return movimientos.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function getAdminTopConsumo(periodo: Periodo = "mes") {
  await requireAdmin();
  const db = await getDb();
  const rango = getRangoPeriodo(periodo);
  const despachosFiltro = filtroFecha(despachos.fechaHora, rango?.desde, rango?.hasta);

  const topInstituciones = await db
    .select({
      estacion: estaciones.nombre,
      nombre: instituciones.nombre,
      total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)`,
    })
    .from(despachos)
    .innerJoin(instituciones, eq(despachos.institucionId, instituciones.id))
    .innerJoin(estaciones, eq(despachos.estacionId, estaciones.id))
    .where(despachosFiltro ?? sql`true`)
    .groupBy(estaciones.nombre, instituciones.id, instituciones.nombre)
    .orderBy(desc(sql`SUM(${despachos.litros})`))
    .limit(10);

  return topInstituciones.map((r) => ({ ...r, total: Number(r.total) }));
}
