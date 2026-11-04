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
