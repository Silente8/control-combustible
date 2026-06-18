-- Ejecutar en Supabase → SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  unidad TEXT NOT NULL DEFAULT 'litros'
);

CREATE TABLE IF NOT EXISTS instituciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT,
  direccion TEXT,
  fecha_registro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS personas (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  documento_identidad TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  institucion_id INTEGER NOT NULL REFERENCES instituciones(id),
  fecha_registro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entradas (
  id SERIAL PRIMARY KEY,
  fecha TEXT NOT NULL,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  litros DOUBLE PRECISION NOT NULL,
  proveedor TEXT,
  numero_documento TEXT,
  usuario_registro TEXT NOT NULL DEFAULT 'admin',
  observaciones TEXT
);

CREATE TABLE IF NOT EXISTS despachos (
  id SERIAL PRIMARY KEY,
  fecha_hora TEXT NOT NULL,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  litros DOUBLE PRECISION NOT NULL,
  tipo_beneficiario TEXT NOT NULL,
  persona_id INTEGER REFERENCES personas(id),
  institucion_id INTEGER REFERENCES instituciones(id),
  usuario_registro TEXT NOT NULL DEFAULT 'admin',
  observaciones TEXT
);

-- Datos iniciales (solo si las tablas están vacías)
INSERT INTO productos (nombre, unidad)
SELECT 'Gasolina', 'litros' WHERE NOT EXISTS (SELECT 1 FROM productos);
INSERT INTO productos (nombre, unidad)
SELECT 'Gasoil', 'litros' WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Gasoil');

INSERT INTO instituciones (nombre, tipo, fecha_registro)
SELECT 'Policía Nacional', 'Gobierno', TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM instituciones);

INSERT INTO instituciones (nombre, tipo, fecha_registro)
SELECT 'Hospital Central', 'Salud', TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM instituciones WHERE nombre = 'Hospital Central');

INSERT INTO instituciones (nombre, tipo, fecha_registro)
SELECT 'Alcaldía Municipal', 'Gobierno', TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM instituciones WHERE nombre = 'Alcaldía Municipal');

INSERT INTO personas (nombre_completo, documento_identidad, telefono, institucion_id, fecha_registro)
SELECT 'Juan Pérez', '001-1234567', '555-0101', 1, TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM personas);

INSERT INTO personas (nombre_completo, documento_identidad, telefono, institucion_id, fecha_registro)
SELECT 'Ana Gómez', '001-7654321', '555-0102', 2, TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM personas WHERE documento_identidad = '001-7654321');

INSERT INTO personas (nombre_completo, documento_identidad, telefono, institucion_id, fecha_registro)
SELECT 'Luis Ríos', '001-9988776', '555-0103', 3, TO_CHAR(NOW(), 'YYYY-MM-DD')
WHERE NOT EXISTS (SELECT 1 FROM personas WHERE documento_identidad = '001-9988776');
