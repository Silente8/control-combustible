-- Limpiar datos de PRUEBA — ZODI N°46
-- Ejecutar en Supabase → SQL Editor cuando termines las pruebas
--
-- CONSERVA: estaciones, productos, perfiles_usuario, usuarios de Auth
-- BORRA: entradas, despachos, personas e instituciones de prueba

-- 1. Movimientos (entradas y despachos)
DELETE FROM despachos;
DELETE FROM entradas;

-- 2. Catálogos por estación (personas e instituciones)
DELETE FROM personas;
DELETE FROM instituciones;

-- 3. Reiniciar contadores (IDs empiezan de 1 otra vez)
ALTER SEQUENCE entradas_id_seq RESTART WITH 1;
ALTER SEQUENCE despachos_id_seq RESTART WITH 1;
ALTER SEQUENCE personas_id_seq RESTART WITH 1;
ALTER SEQUENCE instituciones_id_seq RESTART WITH 1;

-- Verificar que quedó vacío
SELECT 'entradas' AS tabla, COUNT(*) AS registros FROM entradas
UNION ALL SELECT 'despachos', COUNT(*) FROM despachos
UNION ALL SELECT 'personas', COUNT(*) FROM personas
UNION ALL SELECT 'instituciones', COUNT(*) FROM instituciones;
