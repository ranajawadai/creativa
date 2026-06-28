import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";

function createDb() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL ?? "file:./data/creativa.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  } catch {
    return null as any;
  }
}

export const db = createDb();
