# Configuración de usuarios — Multi-estación ZODI N°46

Solo necesitas hacer **2 pasos en Supabase** (no se puede automatizar desde el código).

---

## Paso 1 — Ejecutar migración SQL

En **Supabase → SQL Editor**, ejecuta el archivo:

```
supabase/migration-multi-estacion.sql
```

(Si es proyecto nuevo, usa `supabase/schema.sql` en su lugar.)

---

## Paso 2 — Crear 3 usuarios en Authentication

Ve a **Authentication → Users → Add user → Create new user**.  
Marca **Auto Confirm User** en los tres.

| Correo | Contraseña sugerida | Rol | Estación |
|--------|---------------------|-----|----------|
| `operador.lasdelicias@zodi46-yaracuy.com` | `Delicias2026!` | Operador | Las Delicias |
| `operador.jaimes2@zodi46-yaracuy.com` | `Jaimes2026!` | Operador | Jaimes 2 |
| `admin@zodi46-yaracuy.com` | `AdminZodi2026!` | Administrador | Todas |

Puedes cambiar las contraseñas; lo importante es que el **correo coincida exactamente** con la tabla `perfiles_usuario`.

---

## Cómo funciona

- **Operadores:** entran con su correo → ven su estación en el encabezado → solo ven y registran datos de su estación.
- **Administrador:** entra con `admin@...` → va al **Panel Administrador** → ve Las Delicias + Jaimes 2 consolidados.
- **Misma URL** para los tres (la de Vercel). El sistema detecta el rol al iniciar sesión.

---

## Terminales / tablets

| Terminal | Usuario |
|----------|---------|
| Tablet Las Delicias | `operador.lasdelicias@zodi46-yaracuy.com` |
| Tablet Jaimes 2 | `operador.jaimes2@zodi46-yaracuy.com` |
| PC administrador | `admin@zodi46-yaracuy.com` |

Gira la tablet en **horizontal** para mejor vista.
