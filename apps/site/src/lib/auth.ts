import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as authSchema from "@/lib/auth-schema";
import type { Database } from "@/lib/db";
import { getDatabase } from "@/lib/db";
import { readServerEnv } from "@/lib/env";

/**
 * Nadav's GitHub account, the only one that may sign in (ADR 0005). Matched by numeric id, which
 * never changes, rather than by email, which can be private or changed. It is public (it is in
 * Nadav's noreply address), so it lives in code: changing the admin is a reviewed deploy.
 */
const ADMIN_GITHUB_ID = 40_166_316;

/** Where sign-in starts, and where a rejected or failed sign-in lands with `?error=`. */
export const SIGN_IN_PATH = "/admin/sign-in";

/** The `?error=` reason when an account other than Nadav's tries to sign in. */
export const NOT_ADMIN_REASON = "not_admin";

/** How the Admin panel starts GitHub sign-in: where it lands on success and on failure. */
export const ADMIN_GITHUB_SIGN_IN = {
  provider: "github",
  callbackURL: "/admin",
  errorCallbackURL: SIGN_IN_PATH,
} as const;

interface AuthConfig {
  secret: string;
  baseURL: string | undefined;
  github: { clientId: string; clientSecret: string };
}

/**
 * Better Auth for the Admin panel: GitHub sign-in only, for Nadav's account only. Any other
 * identity is turned away by `validateUserInfo`, which runs before a user row is written and again
 * on every sign-in, so no row and no session ever exists for anyone else.
 */
export function createAuth(db: Database, { secret, baseURL, github }: AuthConfig) {
  return betterAuth({
    appName: "spitzweb",
    secret,
    baseURL,
    database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
    emailAndPassword: { enabled: false },
    socialProviders: { github },
    user: {
      validateUserInfo: ({ source }) => {
        const isAdmin =
          source.oauth?.providerId === "github" && source.oauth.profile?.id === ADMIN_GITHUB_ID;
        if (isAdmin) return;
        return { error: NOT_ADMIN_REASON };
      },
    },
    onAPIError: { errorURL: SIGN_IN_PATH },
    telemetry: { enabled: false },
    // Lets Server Actions set Better Auth's cookies through Next.js's cookies().
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

/**
 * The app's Better Auth, built from the server env and the app's database. Building it is cheap
 * and connects nothing, so each caller builds its own.
 */
export function getAuth() {
  const env = readServerEnv();
  return createAuth(getDatabase(), {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
  });
}
