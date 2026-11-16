import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SignInPanel } from "@/admin/components/sign-in-panel";

const AUTH_ENV_NAMES = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
];

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the Admin panel's sign-in", () => {
  test("offers GitHub sign-in when the deployment has the auth env", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "a-fake-secret-that-is-at-least-32-characters-long");
    vi.stubEnv("GITHUB_CLIENT_ID", "fake-client-id");
    vi.stubEnv("GITHUB_CLIENT_SECRET", "fake-client-secret");

    const html = renderToStaticMarkup(<SignInPanel failureReason={Promise.resolve(undefined)} />);

    expect(html).toContain("Sign in with GitHub");
  });

  test("says sign-in isn’t available, with nothing to press, on a deployment without the auth env", () => {
    for (const name of AUTH_ENV_NAMES) vi.stubEnv(name, undefined);

    const html = renderToStaticMarkup(<SignInPanel failureReason={Promise.resolve(undefined)} />);

    expect(html).toContain("Sign-in isn’t available on this deployment.");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });
});
