# Control Combustible ZODI YARACUY

Sistema web para control de entradas y despachos de combustible.  
Desplegado en **Vercel** con base de datos en **Supabase** (PostgreSQL en la nube).

## Requisitos

- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [GitHub](https://github.com) (para conectar el repo)

---

## Paso 1 — Crear proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) → **New project**
2. Elige nombre, contraseña de BD y región cercana
3. Espera a que termine de crearse (~2 min)

### Crear las tablas

1. Ve a **SQL Editor** → **New query**
2. Copia y pega el contenido de `supabase/schema.sql`
3. Pulsa **Run**

### Obtener las credenciales

En **Project Settings → API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

En **Project Settings → Database → Connection string → URI**:
- Elige **Transaction pooler** (puerto **6543**)
- Copia la URL → `DATABASE_URL`
- Reemplaza `[YOUR-PASSWORD]` con tu contraseña

---

## Paso 2 — Crear usuarios (operadores)

1. Ve a **Authentication → Users → Add user**
2. Crea 3 usuarios (marca **Auto Confirm User**):

| Correo | Rol |
|--------|-----|
| `admin@zodi-yaracuy.com` | Administrador |
| `operador1@zodi-yaracuy.com` | Operador |
| `operador2@zodi-yaracuy.com` | Operador |

3. Asigna una contraseña a cada uno

---

## Paso 3 — Subir a GitHub

```bash
git init
git add .
git commit -m "Control combustible - Vercel + Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/control-combustible.git
git push -u origin main
```

---

## Paso 4 — Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New → Project**
2. Importa el repositorio de GitHub
3. En **Environment Variables** agrega:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `DATABASE_URL` | Connection string (pooler, puerto 6543) |

4. Pulsa **Deploy**

En ~2 minutos tendrás una URL como:

```text
https://control-combustible.vercel.app
```

---

## Paso 5 — Usar desde tablets / internet

1. Abre la URL de Vercel en Chrome o Safari
2. Inicia sesión con el correo y contraseña del operador
3. (Opcional) **Agregar a pantalla de inicio** en la tablet

Todos los operadores ven y editan **los mismos datos** en tiempo real.

---

## Desarrollo local

```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Módulos

- **Panel de Control** — stock, entradas/despachos, rankings
- **Entradas** — combustible recibido
- **Despachos** — a persona o institución (sin cobro)
- **Instituciones / Personas** — base de datos de beneficiarios
- **Historial / Reportes** — filtros y estadísticas

---

## Stack

Next.js 15 · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth) · Drizzle ORM · Vercel
