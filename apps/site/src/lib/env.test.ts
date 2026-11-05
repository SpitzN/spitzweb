import { afterEach, describe, expect, test, vi } from "vitest";
import { readServerEnv } from "@/lib/env";

// Fake values, like the ones CI builds on.
const FAKE_SERVER_ENV = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/spitzweb",
  BETTER_AUTH_SECRET: "a-fake-secret-that-is-at-least-32-characters-long",
  BETTER_AUTH_URL: "http://localhost:3000",
  GITHUB_CLIENT_ID: "fake-client-id",
  GITHUB_CLIENT_SECRET: "fake-client-secret",
};

function stubServerEnv(overrides: Partial<Record<keyof typeof FAKE_SERVER_ENV, string>> = {}) {
  const env = { ...FAKE_SERVER_ENV, ...overrides };
  for (const [name, value] of Object.entries(env)) {
    vi.stubEnv(name, value);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readServerEnv", () => {
  test("returns the server env when every value is well formed", () => {
    stubServerEnv();

    expect(readServerEnv()).toStrictEqual(FAKE_SERVER_ENV);
  });

  test("throws when a value is missing", () => {
    stubServerEnv({ GITHUB_CLIENT_SECRET: "" });

    expect(() => readServerEnv()).toThrow(/GITHUB_CLIENT_SECRET/);
  });

  test("throws when the database URL is not a URL", () => {
    stubServerEnv({ DATABASE_URL: "not a url" });

    expect(() => readServerEnv()).toThrow(/DATABASE_URL/);
  });

  test("throws when the auth secret is too short to sign sessions safely", () => {
    stubServerEnv({ BETTER_AUTH_SECRET: "short" });

    expect(() => readServerEnv()).toThrow(/BETTER_AUTH_SECRET/);
  });
});
