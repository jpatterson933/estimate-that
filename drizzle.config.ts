import { defineConfig } from "drizzle-kit";

const NODE_ENV = process.env.NODE_ENV || "development";
const LIVE_ENVS = ["production", "staging"];

const configPath = NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({ path: configPath });

export const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost:5432/estimatethat";

// Add sslmode=no-verify to the connection string to avoid SSL errors in cloud environments
export const connectionString = LIVE_ENVS.includes(NODE_ENV)
  ? `${DATABASE_URL}?sslmode=no-verify`
  : DATABASE_URL;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: connectionString },
  verbose: true,
});
