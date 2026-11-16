import { afterEach, describe, expect, test, vi } from "vitest";
import { readAuthEnv, readDatabaseEnv } from "@/lib/env";

// Fake values, like the ones CI builds on.
const FAKE_DATABASE_ENV = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/spitzweb",
};
const FAKE_AUTH_ENV = {
  BETTER_AUTH_SECRET: "a-fake-secret-that-is-at-least-32-characters-long",
  BETTER_AUTH_URL: "http://localhost:3000",
  GITHUB_CLIENT_ID: "fake-client-id",
  GITHUB_CLIENT_SECRET: "fake-client-secret",
};

function stubEnv(env: Record<string, string | undefined>) {
  for (const [name, value] of Object.entries(env)) {
    vi.stubEnv(name, value);
  }
}

// A preview's env: the database, and none of the auth variables (docs/setup.md).
function stubPreviewEnv() {
  stubEnv(FAKE_DATABASE_ENV);
  for (const name of Object.keys(FAKE_AUTH_ENV)) vi.stubEnv(name, undefined);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readDatabaseEnv", () => {
  test("returns the database URL", () => {
    stubEnv({ ...FAKE_DATABASE_ENV, ...FAKE_AUTH_ENV });

    expect(readDatabaseEnv()).toStrictEqual(FAKE_DATABASE_ENV);
  });

  test("reads the database on a deployment without the auth env, like a preview", () => {
    stubPreviewEnv();

    expect(readDatabaseEnv()).toStrictEqual(FAKE_DATABASE_ENV);
  });

  test("throws when the database URL is not a URL", () => {
    stubEnv({ DATABASE_URL: "not a url" });

    expect(() => readDatabaseEnv()).toThrow(/DATABASE_URL/);
  });
});

describe("readAuthEnv", () => {
  test("returns the auth env when every value is well formed", () => {
    stubEnv(FAKE_AUTH_ENV);

    expect(readAuthEnv()).toStrictEqual({ ok: true, value: FAKE_AUTH_ENV });
  });

  test("says sign-in isn't configured when none of the auth env is set, like a preview", () => {
    stubPreviewEnv();

    expect(readAuthEnv()).toStrictEqual({ ok: false, error: "not-configured" });
  });

  test("throws when only some of the auth env is set", () => {
    stubEnv({ ...FAKE_AUTH_ENV, GITHUB_CLIENT_SECRET: "" });

    expect(() => readAuthEnv()).toThrow(/GITHUB_CLIENT_SECRET/);
  });

  test("throws when the auth secret is too short to sign sessions safely", () => {
    stubEnv({ ...FAKE_AUTH_ENV, BETTER_AUTH_SECRET: "short" });

    expect(() => readAuthEnv()).toThrow(/BETTER_AUTH_SECRET/);
  });
});
