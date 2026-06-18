import {
  pgTable,
  text,
  integer,
  serial,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const productos = pgTable("productos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  unidad: text("unidad").notNull().default("litros"),
});

export const instituciones = pgTable("instituciones", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo"),
  direccion: text("direccion"),
  fechaRegistro: text("fecha_registro").notNull(),
});

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  nombreCompleto: text("nombre_completo").notNull(),
  documentoIdentidad: text("documento_identidad").notNull(),
  telefono: text("telefono"),
  email: text("email"),
  institucionId: integer("institucion_id")
    .notNull()
    .references(() => instituciones.id),
  fechaRegistro: text("fecha_registro").notNull(),
});

export const entradas = pgTable("entradas", {
  id: serial("id").primaryKey(),
  fecha: text("fecha").notNull(),
  productoId: integer("producto_id")
    .notNull()
    .references(() => productos.id),
  litros: doublePrecision("litros").notNull(),
  proveedor: text("proveedor"),
  numeroDocumento: text("numero_documento"),
  usuarioRegistro: text("usuario_registro").notNull().default("admin"),
  observaciones: text("observaciones"),
});

export const despachos = pgTable("despachos", {
  id: serial("id").primaryKey(),
  fechaHora: text("fecha_hora").notNull(),
  productoId: integer("producto_id")
    .notNull()
    .references(() => productos.id),
  litros: doublePrecision("litros").notNull(),
  tipoBeneficiario: text("tipo_beneficiario").notNull(),
  personaId: integer("persona_id").references(() => personas.id),
  institucionId: integer("institucion_id").references(() => instituciones.id),
  usuarioRegistro: text("usuario_registro").notNull().default("admin"),
  observaciones: text("observaciones"),
});

export type Producto = typeof productos.$inferSelect;
export type Institucion = typeof instituciones.$inferSelect;
export type Persona = typeof personas.$inferSelect;
export type Entrada = typeof entradas.$inferSelect;
export type Despacho = typeof despachos.$inferSelect;
