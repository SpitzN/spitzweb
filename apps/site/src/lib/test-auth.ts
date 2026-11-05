import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { vi } from "vitest";
import { z } from "zod";
import type { Auth } from "@/lib/auth";
import { ADMIN_GITHUB_SIGN_IN, createAuth } from "@/lib/auth";
import type { Database } from "@/lib/db";

// Test support for code that signs in: a PGlite database with the real migrations applied, the
// app's Better Auth on top of it, and a GitHub stand-in so the real OAuth callback can run.

const BASE_URL = "http://localhost:3000";

/** An in-memory Postgres with every committed migration applied (docs/conventions.md, Testing). */
export async function createTestDatabase() {
  const db = drizzle({ client: new PGlite() });
  await migrate(db, { migrationsFolder: "drizzle" });
  return db;
}

/** The app's Better Auth on the given database, with fake credentials. */
export function createTestAuth(db: Database) {
  return createAuth(db, {
    secret: "a-fake-secret-that-is-at-least-32-characters-long",
    baseURL: BASE_URL,
    github: { clientId: "fake-client-id", clientSecret: "fake-client-secret" },
  });
}

function stubGitHub(githubId: number) {
  const login = `account-${String(githubId)}`;
  const email = `${login}@example.com`;
  // Raw JSON bodies, because GitHub's field names are snake_case.
  const responses = new Map([
    ["https://github.com/login/oauth/access_token", '{"access_token":"fake-access-token"}'],
    ["https://api.github.com/user", JSON.stringify({ id: githubId, login, name: login, email })],
    [
      "https://api.github.com/user/emails",
      JSON.stringify([{ email, primary: true, verified: true }]),
    ],
  ]);

  vi.stubGlobal("fetch", (input: Request | URL | string) => {
    const url = input instanceof Request ? input.url : String(input);
    const body = responses.get(url);
    if (body === undefined) throw new Error(`Unexpected request in a test: ${url}`);
    return Promise.resolve(new Response(body, { headers: { "content-type": "application/json" } }));
  });
}

function cookieHeaderFrom(response: Response) {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";", 1)[0])
    .join("; ");
}

/**
 * Runs the whole GitHub sign-in as a browser would: starts it, then comes back to Better Auth's
 * callback as the GitHub account with this numeric id. Returns the callback's response (a
 * redirect) and the cookie header a browser would then send.
 */
export async function signInAsGitHubAccount(auth: Auth, githubId: number) {
  stubGitHub(githubId);
  try {
    const start = await auth.api.signInSocial({
      body: ADMIN_GITHUB_SIGN_IN,
      asResponse: true,
    });
    const { url } = z.object({ url: z.url() }).parse(await start.json());
    const state = new URL(url).searchParams.get("state") ?? "";

    const callbackUrl = new URL("/api/auth/callback/github", BASE_URL);
    callbackUrl.search = new URLSearchParams({ code: "fake-code", state }).toString();
    const response = await auth.handler(
      new Request(callbackUrl, { headers: { cookie: cookieHeaderFrom(start) } }),
    );
    return { response, cookie: cookieHeaderFrom(response) };
  } finally {
    vi.unstubAllGlobals();
  }
}
