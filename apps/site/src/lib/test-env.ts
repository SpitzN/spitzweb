import { vi } from "vitest";
import { AUTH_ENV_NAMES } from "@/lib/env";

/** Fake values, like the ones CI builds on. */
export const FAKE_DATABASE_ENV = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/spitzweb",
};

/** Fake auth values, like the ones CI builds on. */
export const FAKE_AUTH_ENV = {
  BETTER_AUTH_SECRET: "a-fake-secret-that-is-at-least-32-characters-long",
  BETTER_AUTH_URL: "http://localhost:3000",
  GITHUB_CLIENT_ID: "fake-client-id",
  GITHUB_CLIENT_SECRET: "fake-client-secret",
};

/** Stubs each variable for the current test; `undefined` unsets it. Undo with `vi.unstubAllEnvs()`. */
export function stubEnv(env: Record<string, string | undefined>) {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
}

/** A deployment with sign-in: the database and every auth variable. */
export function stubAuthEnv() {
  stubEnv({ ...FAKE_DATABASE_ENV, ...FAKE_AUTH_ENV });
}

/** A preview's env: the database, and none of the auth variables (docs/setup.md). */
export function stubPreviewEnv() {
  stubEnv(FAKE_DATABASE_ENV);
  for (const name of AUTH_ENV_NAMES) vi.stubEnv(name, undefined);
}
