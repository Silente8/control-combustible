-- Esquema completo multi-estación — ZODI N°46 Yaracuy
-- Ejecutar en Supabase → SQL Editor (proyecto nuevo)

CREATE TABLE IF NOT EXISTS estaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  activa INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS perfiles_usuario (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('operador', 'admin')),
  estacion_id INTEGER REFERENCES estaciones(id)
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  unidad TEXT NOT NULL DEFAULT 'litros'
);

CREATE TABLE IF NOT EXISTS instituciones (
  id SERIAL PRIMARY KEY,
  estacion_id INTEGER NOT NULL REFERENCES estaciones(id),
  nombre TEXT NOT NULL,
  tipo TEXT,
  direccion TEXT,
  fecha_registro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS personas (
  id SERIAL PRIMARY KEY,
  estacion_id INTEGER NOT NULL REFERENCES estaciones(id),
  nombre_completo TEXT NOT NULL,
  documento_identidad TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  institucion_id INTEGER NOT NULL REFERENCES instituciones(id),
  fecha_registro TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entradas (
  id SERIAL PRIMARY KEY,
  estacion_id INTEGER NOT NULL REFERENCES estaciones(id),
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
  estacion_id INTEGER NOT NULL REFERENCES estaciones(id),
  fecha_hora TEXT NOT NULL,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  litros DOUBLE PRECISION NOT NULL,
  tipo_beneficiario TEXT NOT NULL,
  persona_id INTEGER REFERENCES personas(id),
  institucion_id INTEGER REFERENCES instituciones(id),
  usuario_registro TEXT NOT NULL DEFAULT 'admin',
  observaciones TEXT
);

-- Estaciones
INSERT INTO estaciones (nombre)
SELECT 'Las Delicias' WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre = 'Las Delicias');
INSERT INTO estaciones (nombre)
SELECT 'Jaimes 2' WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre = 'Jaimes 2');

-- Perfiles (emails deben coincidir con Supabase Auth)
INSERT INTO perfiles_usuario (email, rol, estacion_id)
SELECT 'operador.lasdelicias@zodi46-yaracuy.com', 'operador', id
FROM estaciones WHERE nombre = 'Las Delicias'
ON CONFLICT (email) DO NOTHING;

INSERT INTO perfiles_usuario (email, rol, estacion_id)
SELECT 'operador.jaimes2@zodi46-yaracuy.com', 'operador', id
FROM estaciones WHERE nombre = 'Jaimes 2'
ON CONFLICT (email) DO NOTHING;

INSERT INTO perfiles_usuario (email, rol, estacion_id)
VALUES ('admin@zodi46-yaracuy.com', 'admin', NULL)
ON CONFLICT (email) DO NOTHING;

-- Productos
INSERT INTO productos (nombre, unidad)
SELECT 'Gasolina', 'litros' WHERE NOT EXISTS (SELECT 1 FROM productos);
INSERT INTO productos (nombre, unidad)
SELECT 'Gasoil', 'litros' WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Gasoil');

-- Instituciones demo Las Delicias
INSERT INTO instituciones (estacion_id, nombre, tipo, fecha_registro)
SELECT e.id, 'Policía Nacional', 'Gobierno', TO_CHAR(NOW(), 'YYYY-MM-DD')
FROM estaciones e WHERE e.nombre = 'Las Delicias'
AND NOT EXISTS (SELECT 1 FROM instituciones i WHERE i.estacion_id = e.id);

-- Instituciones demo Jaimes 2
INSERT INTO instituciones (estacion_id, nombre, tipo, fecha_registro)
SELECT e.id, 'Bomberos', 'Emergencias', TO_CHAR(NOW(), 'YYYY-MM-DD')
FROM estaciones e WHERE e.nombre = 'Jaimes 2'
AND NOT EXISTS (SELECT 1 FROM instituciones i WHERE i.estacion_id = e.id AND i.nombre = 'Bomberos');
