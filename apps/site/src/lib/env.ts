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

const serverEnvSchema = z.object({
  // Neon's pooled connection string. Migrations use the direct one, read by drizzle.config.ts.
  DATABASE_URL: z.url(),
  // Signs session cookies. Better Auth refuses anything shorter in production.
  BETTER_AUTH_SECRET: z.string().min(32),
  // The site's own origin. A preview leaves it unset, and Better Auth takes the request's origin.
  BETTER_AUTH_URL: z.url().optional(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
});

/**
 * Env only the server may read, parsed. Call it where a value is used, never at module top level,
 * so the build runs without it (.claude/rules/server.md, Env). Throws, naming each bad variable,
 * when a value is missing or malformed. Only the variables named in the schema are returned.
 */
export function readServerEnv() {
  return serverEnvSchema.parse(process.env);
}
