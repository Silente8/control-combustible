-- Ejecutar en Supabase → SQL Editor (proyecto existente con datos)
-- Migra a multi-estación: Las Delicias + Jaimes 2

-- 1. Estaciones
CREATE TABLE IF NOT EXISTS estaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  activa INTEGER NOT NULL DEFAULT 1
);

INSERT INTO estaciones (nombre)
SELECT 'Las Delicias' WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre = 'Las Delicias');

INSERT INTO estaciones (nombre)
SELECT 'Jaimes 2' WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre = 'Jaimes 2');

-- 2. Perfiles de usuario (vincular con emails de Supabase Auth)
CREATE TABLE IF NOT EXISTS perfiles_usuario (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('operador', 'admin')),
  estacion_id INTEGER REFERENCES estaciones(id)
);

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

-- 3. Agregar estacion_id a tablas existentes
ALTER TABLE instituciones ADD COLUMN IF NOT EXISTS estacion_id INTEGER REFERENCES estaciones(id);
ALTER TABLE personas ADD COLUMN IF NOT EXISTS estacion_id INTEGER REFERENCES estaciones(id);
ALTER TABLE entradas ADD COLUMN IF NOT EXISTS estacion_id INTEGER REFERENCES estaciones(id);
ALTER TABLE despachos ADD COLUMN IF NOT EXISTS estacion_id INTEGER REFERENCES estaciones(id);

-- 4. Asignar datos existentes a Las Delicias
UPDATE instituciones SET estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Las Delicias' LIMIT 1)
WHERE estacion_id IS NULL;

UPDATE personas SET estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Las Delicias' LIMIT 1)
WHERE estacion_id IS NULL;

UPDATE entradas SET estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Las Delicias' LIMIT 1)
WHERE estacion_id IS NULL;

UPDATE despachos SET estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Las Delicias' LIMIT 1)
WHERE estacion_id IS NULL;

-- 5. Hacer obligatorio estacion_id
ALTER TABLE instituciones ALTER COLUMN estacion_id SET NOT NULL;
ALTER TABLE personas ALTER COLUMN estacion_id SET NOT NULL;
ALTER TABLE entradas ALTER COLUMN estacion_id SET NOT NULL;
ALTER TABLE despachos ALTER COLUMN estacion_id SET NOT NULL;
