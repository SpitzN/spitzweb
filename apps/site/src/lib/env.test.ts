import { afterEach, describe, expect, test, vi } from "vitest";
import { readAuthEnv, readDatabaseEnv } from "@/lib/env";
import {
  FAKE_AUTH_ENV,
  FAKE_DATABASE_ENV,
  stubAuthEnv,
  stubEnv,
  stubPreviewEnv,
} from "@/lib/test-env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readDatabaseEnv", () => {
  test("returns the database URL", () => {
    stubAuthEnv();

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
    stubAuthEnv();

    expect(readAuthEnv()).toStrictEqual({ ok: true, value: FAKE_AUTH_ENV });
  });

  test("says sign-in isn't configured when none of the auth env is set, like a preview", () => {
    stubPreviewEnv();

    expect(readAuthEnv()).toStrictEqual({ ok: false, error: "not-configured" });
  });

  test("throws, naming it, when one auth variable is missing and the rest are set", () => {
    stubAuthEnv();
    stubEnv({ GITHUB_CLIENT_SECRET: undefined });

    expect(() => readAuthEnv()).toThrow(/GITHUB_CLIENT_SECRET/);
  });

  test("throws when a GitHub credential is empty", () => {
    stubAuthEnv();
    stubEnv({ GITHUB_CLIENT_ID: "" });

    expect(() => readAuthEnv()).toThrow(/GITHUB_CLIENT_ID/);
  });

  test("throws when the auth secret is too short to sign sessions safely", () => {
    stubAuthEnv();
    stubEnv({ BETTER_AUTH_SECRET: "short" });

    expect(() => readAuthEnv()).toThrow(/BETTER_AUTH_SECRET/);
  });
});
