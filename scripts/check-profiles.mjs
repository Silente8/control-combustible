import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL no configurada");
    process.exit(1);
  }
  const sql = postgres(connectionString, { prepare: false });
  const rows = await sql`
    SELECT p.email, p.rol, p.estacion_id, e.nombre AS estacion
    FROM perfiles_usuario p
    LEFT JOIN estaciones e ON p.estacion_id = e.id
    ORDER BY p.id
  `;
  console.log(JSON.stringify(rows, null, 2));
  await sql.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
