import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
});

/**
 * Env that is safe for the browser to see, parsed. Readable on the server, in the browser and in
 * next.config.ts. Throws when a value is set but malformed. Each value is named in full because
 * Next.js inlines `process.env.NEXT_PUBLIC_*` into the client bundle only when written out.
 */
export function readPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

const databaseEnvSchema = z.object({
  // Neon's pooled connection string. Migrations use the direct one, read by drizzle.config.ts.
  DATABASE_URL: z.url(),
});

/**
 * The database's env, parsed: only what the database client needs, so a deployment without the
 * auth env (every preview) still reads its database. Call it where the value is used, never at
 * module top level, so the build runs without it (.claude/rules/server.md, Env). Throws, naming
 * the variable, when it is missing or malformed.
 */
export function readDatabaseEnv() {
  return databaseEnvSchema.parse(process.env);
}

const authEnvSchema = z.object({
  // Signs session cookies. Better Auth refuses anything shorter in production.
  BETTER_AUTH_SECRET: z.string().min(32),
  // The site's own origin. A preview leaves it unset, and Better Auth takes the request's origin.
  BETTER_AUTH_URL: z.url().optional(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
});

/**
 * Better Auth's env, parsed, as a result: `ok: false` when the deployment sets none of it, like
 * every preview, so sign-in is unavailable rather than broken (the OAuth apps call back only to
 * production and localhost; docs/setup.md). Throws, naming each bad variable, when only some of it
 * is set or a value is malformed. Call it where the value is used.
 */
export function readAuthEnv() {
  const isConfigured = Object.values(authEnvSchema.partial().parse(process.env)).some(
    (value) => value !== undefined,
  );
  return isConfigured
    ? { ok: true as const, value: authEnvSchema.parse(process.env) }
    : { ok: false as const, error: "not-configured" as const };
}
