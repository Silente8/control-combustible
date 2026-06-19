# Operadores no entran — solución

Revisé la base de datos: los **perfiles están bien**. El admin entra porque su correo en Auth coincide con la BD.

Lo más probable: los operadores en **Authentication** tienen **otro correo** o **contraseña incorrecta**.

---

## Paso 1 — Ver correos en Supabase Auth

1. **Supabase → Authentication → Users**
2. Busca los dos operadores (no el admin)
3. Anota el correo **exacto** de cada uno

Deben ser **exactamente**:

- `operador.lasdelicias@zodi46-yaracuy.com`
- `operador.jaimes2@zodi46-yaracuy.com`

Si ves otro (ej. `operador1@zodi-yaracuy.com`), **no van a entrar**.

---

## Paso 2 — Opción A: Crear usuarios con el correo correcto

1. **Delete** los operadores con correo incorrecto (si existen)
2. **Add user → Create new user**
3. Email: `operador.lasdelicias@zodi46-yaracuy.com`
4. Password: la que quieras (ej. `Delicias2026!`)
5. Marca **Auto Confirm User** ✓
6. Repite para `operador.jaimes2@zodi46-yaracuy.com` (ej. `Jaimes2026!`)

---

## Paso 2 — Opción B: Ajustar la BD a tus correos

Si ya creaste operadores con otros correos y no quieres borrarlos, en **SQL Editor** (cambia el correo por el tuyo real):

```sql
-- Las Delicias
UPDATE perfiles_usuario
SET email = 'TU-CORREO-REAL-LAS-DELICIAS@...'
WHERE rol = 'operador' AND estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Las Delicias');

-- Jaimes 2
UPDATE perfiles_usuario
SET email = 'TU-CORREO-REAL-JAIMES2@...'
WHERE rol = 'operador' AND estacion_id = (SELECT id FROM estaciones WHERE nombre = 'Jaimes 2');
```

---

## Paso 3 — Resetear contraseña

Si el correo es correcto pero dice *"Correo o contraseña incorrectos"*:

1. **Authentication → Users** → clic en el operador
2. **Send password recovery** o asigna contraseña nueva
3. Prueba con esa clave

---

## Qué mensaje ves al fallar

| Mensaje | Causa |
|---------|--------|
| Correo o contraseña incorrectos | Auth: usuario no existe o clave mala |
| Usuario no configurado | Auth OK pero correo ≠ `perfiles_usuario` |
| Operador sin estación | Perfil sin estación (poco común) |

---

## Contraseñas sugeridas (solo si las usaste al crear)

| Correo | Contraseña sugerida |
|--------|---------------------|
| operador.lasdelicias@zodi46-yaracuy.com | `Delicias2026!` |
| operador.jaimes2@zodi46-yaracuy.com | `Jaimes2026!` |

Si pusiste otra al crear el usuario, usa **esa**.
