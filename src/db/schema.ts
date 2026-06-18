import {
  pgTable,
  text,
  integer,
  serial,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const estaciones = pgTable("estaciones", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  activa: integer("activa").notNull().default(1),
});

export const perfilesUsuario = pgTable("perfiles_usuario", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  rol: text("rol").notNull(),
  estacionId: integer("estacion_id").references(() => estaciones.id),
});

export const productos = pgTable("productos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  unidad: text("unidad").notNull().default("litros"),
});

export const instituciones = pgTable("instituciones", {
  id: serial("id").primaryKey(),
  estacionId: integer("estacion_id")
    .notNull()
    .references(() => estaciones.id),
  nombre: text("nombre").notNull(),
  tipo: text("tipo"),
  direccion: text("direccion"),
  fechaRegistro: text("fecha_registro").notNull(),
});

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  estacionId: integer("estacion_id")
    .notNull()
    .references(() => estaciones.id),
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
  estacionId: integer("estacion_id")
    .notNull()
    .references(() => estaciones.id),
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
  estacionId: integer("estacion_id")
    .notNull()
    .references(() => estaciones.id),
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

export type Estacion = typeof estaciones.$inferSelect;
export type PerfilUsuario = typeof perfilesUsuario.$inferSelect;
export type Producto = typeof productos.$inferSelect;
export type Institucion = typeof instituciones.$inferSelect;
export type Persona = typeof personas.$inferSelect;
export type Entrada = typeof entradas.$inferSelect;
export type Despacho = typeof despachos.$inferSelect;
