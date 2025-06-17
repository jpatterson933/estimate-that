import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../env";

// Initialize a connection pool using the DATABASE_URL from the validated env object
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Drizzle client – use this in your app
export const db = drizzle(pool);

// In rare cases (tests / graceful shutdown) you might need direct access to the pool.
export { pool };
