"use server";

import { getDb } from "@/db";
import {
  productos,
  instituciones,
  personas,
  entradas,
  despachos,
} from "@/db/schema";
import { eq, sql, and, gte, lte, desc, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getRangoPeriodo, type Periodo } from "@/lib/utils";
import { getCurrentUserLabel } from "@/lib/supabase/server";

export async function getProductos() {
  const db = await getDb();
  return db.select().from(productos);
}

export async function getInstituciones(search?: string) {
  const db = await getDb();
  if (search) {
    return db
      .select()
      .from(instituciones)
      .where(like(instituciones.nombre, `%${search}%`));
  }
  return db.select().from(instituciones).orderBy(instituciones.nombre);
}

export async function getInstitucionById(id: number) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(instituciones)
    .where(eq(instituciones.id, id))
    .limit(1);
  return row ?? null;
}

export async function getPersonaById(id: number) {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(personas)
    .where(eq(personas.id, id))
    .limit(1);
  return row ?? null;
}

export async function getPersonas(search?: string) {
  const db = await getDb();
  const query = db
    .select({
      id: personas.id,
      nombreCompleto: personas.nombreCompleto,
      documentoIdentidad: personas.documentoIdentidad,
      telefono: personas.telefono,
      email: personas.email,
      institucionId: personas.institucionId,
      fechaRegistro: personas.fechaRegistro,
      institucionNombre: instituciones.nombre,
    })
    .from(personas)
    .leftJoin(instituciones, eq(personas.institucionId, instituciones.id));

  if (search) {
    return query.where(
      or(
        like(personas.nombreCompleto, `%${search}%`),
        like(personas.documentoIdentidad, `%${search}%`)
      )
    );
  }
  return query;
}

export async function getStockPorProducto() {
  const db = await getDb();
  const allProductos = await getProductos();
  const result = [];

  for (const producto of allProductos) {
    const [entradasSum] = await db
      .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
      .from(entradas)
      .where(eq(entradas.productoId, producto.id));

    const [despachosSum] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .where(eq(despachos.productoId, producto.id));

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

export async function getDashboardStats(periodo: Periodo = "mes") {
  const db = await getDb();
  const rango = getRangoPeriodo(periodo);
  const desde = rango?.desde;
  const hasta = rango?.hasta;

  const stock = await getStockPorProducto();
  const entradasFiltro = filtroFecha(entradas.fecha, desde, hasta);
  const despachosFiltro = filtroFecha(despachos.fechaHora, desde, hasta);

  const [totalEntradas] = await db
    .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
    .from(entradas)
    .where(entradasFiltro);

  const [totalDespachos] = await db
    .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
    .from(despachos)
    .where(despachosFiltro);

  const topInstituciones = await db
    .select({
      nombre: instituciones.nombre,
      total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)`,
    })
    .from(despachos)
    .innerJoin(instituciones, eq(despachos.institucionId, instituciones.id))
    .where(despachosFiltro)
    .groupBy(instituciones.id, instituciones.nombre)
    .orderBy(desc(sql`SUM(${despachos.litros})`))
    .limit(5);

  const topPersonas = await db
    .select({
      nombre: personas.nombreCompleto,
      total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)`,
    })
    .from(despachos)
    .innerJoin(personas, eq(despachos.personaId, personas.id))
    .where(despachosFiltro)
    .groupBy(personas.id, personas.nombreCompleto)
    .orderBy(desc(sql`SUM(${despachos.litros})`))
    .limit(5);

  return {
    stock,
    totalEntradas: Number(totalEntradas?.total ?? 0),
    totalDespachos: Number(totalDespachos?.total ?? 0),
    topInstituciones: topInstituciones.map((r) => ({
      ...r,
      total: Number(r.total),
    })),
    topPersonas: topPersonas.map((r) => ({ ...r, total: Number(r.total) })),
  };
}

export async function getHistorial(filtros?: {
  desde?: string;
  hasta?: string;
  tipo?: "entrada" | "despacho" | "todos";
  productoId?: number;
}) {
  const db = await getDb();
  const movimientos: Array<{
    id: number;
    fecha: string;
    tipo: "entrada" | "despacho";
    producto: string;
    litros: number;
    beneficiario: string;
    usuario: string;
  }> = [];

  if (!filtros?.tipo || filtros.tipo === "entrada" || filtros.tipo === "todos") {
    const condiciones = [];
    if (filtros?.desde) condiciones.push(gte(entradas.fecha, filtros.desde));
    if (filtros?.hasta) condiciones.push(lte(entradas.fecha, filtros.hasta));
    if (filtros?.productoId)
      condiciones.push(eq(entradas.productoId, filtros.productoId));

    const rows = await db
      .select({
        id: entradas.id,
        fecha: entradas.fecha,
        litros: entradas.litros,
        usuario: entradas.usuarioRegistro,
        producto: productos.nombre,
      })
      .from(entradas)
      .innerJoin(productos, eq(entradas.productoId, productos.id))
      .where(condiciones.length > 0 ? and(...condiciones) : undefined);

    for (const row of rows) {
      movimientos.push({
        id: row.id,
        fecha: row.fecha,
        tipo: "entrada",
        producto: row.producto,
        litros: row.litros,
        beneficiario: "-",
        usuario: row.usuario,
      });
    }
  }

  if (!filtros?.tipo || filtros.tipo === "despacho" || filtros.tipo === "todos") {
    const condiciones = [];
    if (filtros?.desde) condiciones.push(gte(despachos.fechaHora, filtros.desde));
    if (filtros?.hasta)
      condiciones.push(lte(despachos.fechaHora, `${filtros.hasta}T23:59:59`));
    if (filtros?.productoId)
      condiciones.push(eq(despachos.productoId, filtros.productoId));

    const rows = await db
      .select({
        id: despachos.id,
        fecha: despachos.fechaHora,
        litros: despachos.litros,
        usuario: despachos.usuarioRegistro,
        producto: productos.nombre,
        tipoBeneficiario: despachos.tipoBeneficiario,
        personaNombre: personas.nombreCompleto,
        institucionNombre: instituciones.nombre,
      })
      .from(despachos)
      .innerJoin(productos, eq(despachos.productoId, productos.id))
      .leftJoin(personas, eq(despachos.personaId, personas.id))
      .leftJoin(instituciones, eq(despachos.institucionId, instituciones.id))
      .where(condiciones.length > 0 ? and(...condiciones) : undefined);

    for (const row of rows) {
      movimientos.push({
        id: row.id,
        fecha: row.fecha,
        tipo: "despacho",
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

export async function getReporteResumen(desde?: string, hasta?: string) {
  const db = await getDb();
  const stock = await getStockPorProducto();
  const entradasFiltro = filtroFecha(entradas.fecha, desde, hasta);
  const despachosFiltro = filtroFecha(despachos.fechaHora, desde, hasta);

  const resumen = [];
  for (const item of stock) {
    const [ent] = await db
      .select({ total: sql<number>`COALESCE(SUM(${entradas.litros}), 0)` })
      .from(entradas)
      .where(
        and(eq(entradas.productoId, item.producto.id), entradasFiltro ?? sql`true`)
      );

    const [des] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .where(
        and(eq(despachos.productoId, item.producto.id), despachosFiltro ?? sql`true`)
      );

    resumen.push({
      producto: item.producto.nombre,
      entradas: Number(ent?.total ?? 0),
      despachos: Number(des?.total ?? 0),
      saldo: item.disponible,
    });
  }

  const instList = await db
    .select({ id: instituciones.id, nombre: instituciones.nombre })
    .from(instituciones);

  const consumoPorInstitucion = [];

  for (const inst of instList) {
    const [directo] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .where(
        and(eq(despachos.institucionId, inst.id), despachosFiltro ?? sql`true`)
      );

    const [viaPersonas] = await db
      .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
      .from(despachos)
      .innerJoin(personas, eq(despachos.personaId, personas.id))
      .where(
        and(
          eq(personas.institucionId, inst.id),
          eq(despachos.tipoBeneficiario, "persona"),
          despachosFiltro ?? sql`true`
        )
      );

    const totalDirecto = Number(directo?.total ?? 0);
    const totalViaPersonas = Number(viaPersonas?.total ?? 0);
    const total = totalDirecto + totalViaPersonas;

    if (total > 0) {
      consumoPorInstitucion.push({
        nombre: inst.nombre,
        directo: totalDirecto,
        viaPersonas: totalViaPersonas,
        total,
      });
    }
  }

  consumoPorInstitucion.sort((a, b) => b.total - a.total);

  return { resumen, consumoPorInstitucion };
}

export async function createEntrada(data: {
  fecha: string;
  productoId: number;
  litros: number;
  proveedor?: string;
  numeroDocumento?: string;
  observaciones?: string;
}) {
  if (data.litros <= 0) return { error: "Los litros deben ser mayor a 0" };

  const db = await getDb();
  const usuario = await getCurrentUserLabel();

  await db.insert(entradas).values({
    fecha: data.fecha,
    productoId: data.productoId,
    litros: data.litros,
    proveedor: data.proveedor || null,
    numeroDocumento: data.numeroDocumento || null,
    observaciones: data.observaciones || null,
    usuarioRegistro: usuario,
  });

  revalidatePath("/");
  revalidatePath("/entradas");
  revalidatePath("/historial");
  revalidatePath("/reportes");
  return { success: true };
}

export async function createDespacho(data: {
  fechaHora: string;
  productoId: number;
  litros: number;
  tipoBeneficiario: "persona" | "institucion";
  personaId?: number;
  institucionId?: number;
  observaciones?: string;
}) {
  if (data.litros <= 0) return { error: "Los litros deben ser mayor a 0" };

  if (data.tipoBeneficiario === "persona" && !data.personaId) {
    return { error: "Debe seleccionar una persona" };
  }
  if (data.tipoBeneficiario === "institucion" && !data.institucionId) {
    return { error: "Debe seleccionar una institución" };
  }

  const stock = await getStockPorProducto();
  const productoStock = stock.find((s) => s.producto.id === data.productoId);
  if (!productoStock || data.litros > productoStock.disponible) {
    return {
      error: `Stock insuficiente. Disponible: ${productoStock?.disponible.toFixed(2) ?? 0} L`,
    };
  }

  const db = await getDb();
  const usuario = await getCurrentUserLabel();

  await db.insert(despachos).values({
    fechaHora: data.fechaHora,
    productoId: data.productoId,
    litros: data.litros,
    tipoBeneficiario: data.tipoBeneficiario,
    personaId: data.tipoBeneficiario === "persona" ? data.personaId : null,
    institucionId: data.tipoBeneficiario === "institucion" ? data.institucionId : null,
    observaciones: data.observaciones || null,
    usuarioRegistro: usuario,
  });

  revalidatePath("/");
  revalidatePath("/despachos");
  revalidatePath("/historial");
  revalidatePath("/reportes");
  return { success: true };
}

export async function createInstitucion(data: {
  nombre: string;
  tipo?: string;
  direccion?: string;
}) {
  if (!data.nombre.trim()) return { error: "El nombre es obligatorio" };

  const db = await getDb();
  await db.insert(instituciones).values({
    nombre: data.nombre.trim(),
    tipo: data.tipo || null,
    direccion: data.direccion || null,
    fechaRegistro: new Date().toISOString().split("T")[0],
  });

  revalidatePath("/instituciones");
  revalidatePath("/personas");
  revalidatePath("/despachos");
  return { success: true };
}

export async function updateInstitucion(
  id: number,
  data: { nombre: string; tipo?: string; direccion?: string }
) {
  if (!data.nombre.trim()) return { error: "El nombre es obligatorio" };

  const db = await getDb();
  await db
    .update(instituciones)
    .set({
      nombre: data.nombre.trim(),
      tipo: data.tipo || null,
      direccion: data.direccion || null,
    })
    .where(eq(instituciones.id, id));

  revalidatePath("/instituciones");
  revalidatePath("/personas");
  return { success: true };
}

export async function createPersona(data: {
  nombreCompleto: string;
  documentoIdentidad: string;
  institucionId: number;
  telefono?: string;
  email?: string;
}) {
  if (!data.nombreCompleto.trim()) return { error: "El nombre es obligatorio" };
  if (!data.documentoIdentidad.trim()) return { error: "El documento es obligatorio" };

  const db = await getDb();
  await db.insert(personas).values({
    nombreCompleto: data.nombreCompleto.trim(),
    documentoIdentidad: data.documentoIdentidad.trim(),
    institucionId: data.institucionId,
    telefono: data.telefono || null,
    email: data.email || null,
    fechaRegistro: new Date().toISOString().split("T")[0],
  });

  revalidatePath("/personas");
  revalidatePath("/despachos");
  return { success: true };
}

export async function updatePersona(
  id: number,
  data: {
    nombreCompleto: string;
    documentoIdentidad: string;
    institucionId: number;
    telefono?: string;
    email?: string;
  }
) {
  if (!data.nombreCompleto.trim()) return { error: "El nombre es obligatorio" };

  const db = await getDb();
  await db
    .update(personas)
    .set({
      nombreCompleto: data.nombreCompleto.trim(),
      documentoIdentidad: data.documentoIdentidad.trim(),
      institucionId: data.institucionId,
      telefono: data.telefono || null,
      email: data.email || null,
    })
    .where(eq(personas.id, id));

  revalidatePath("/personas");
  revalidatePath("/despachos");
  return { success: true };
}

export async function getInstitucionDetalle(id: number) {
  const db = await getDb();
  const [inst] = await db
    .select()
    .from(instituciones)
    .where(eq(instituciones.id, id))
    .limit(1);

  if (!inst) return null;

  const [directo] = await db
    .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
    .from(despachos)
    .where(eq(despachos.institucionId, id));

  const [viaPersonas] = await db
    .select({ total: sql<number>`COALESCE(SUM(${despachos.litros}), 0)` })
    .from(despachos)
    .innerJoin(personas, eq(despachos.personaId, personas.id))
    .where(eq(personas.institucionId, id));

  const personasInst = await db
    .select()
    .from(personas)
    .where(eq(personas.institucionId, id));

  const d = Number(directo?.total ?? 0);
  const v = Number(viaPersonas?.total ?? 0);

  return {
    ...inst,
    despachosDirectos: d,
    despachosViaPersonas: v,
    consumoTotal: d + v,
    personas: personasInst,
  };
}
