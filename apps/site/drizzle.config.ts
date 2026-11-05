import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Locally the URL comes from .env.local, which Next.js loads for the app but drizzle-kit doesn't.
// On Vercel it is already in the environment (ADR 0009). drizzle-kit runs from apps/site.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  // Every slice keeps its tables in its own schema.ts; Better Auth's live in lib/.
  schema: ["./src/**/schema.ts", "./src/lib/auth-schema.ts"],
  out: "./drizzle",
  // Migrations need a direct connection: Neon's pooler doesn't keep a session across statements.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
  strict: true,
  verbose: true,
});
