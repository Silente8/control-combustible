import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let dbInstance: DbInstance | null = null;

function createDb(): DbInstance {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

export async function getDb(): Promise<DbInstance> {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  return dbInstance;
}
