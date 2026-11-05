import { describe, expect, test } from "vitest";
import { endAdminSession, requireAdminSession } from "@/admin/server/admin-session";
import { createTestAuth, createTestDatabase, signInAsGitHubAccount } from "@/lib/test-auth";

describe("requireAdminSession", () => {
  test("redirects to sign-in when the request has no session", async () => {
    const auth = createTestAuth(await createTestDatabase());

    await expect(requireAdminSession(auth, new Headers())).rejects.toThrow("NEXT_REDIRECT");
    await expect(requireAdminSession(auth, new Headers())).rejects.toHaveProperty(
      "digest",
      "NEXT_REDIRECT;replace;/admin/sign-in;307;",
    );
  });

  test("returns Nadav's session when Nadav is signed in", async () => {
    const auth = createTestAuth(await createTestDatabase());
    const { cookie } = await signInAsGitHubAccount(auth, 40_166_316);

    const adminSession = await requireAdminSession(auth, new Headers({ cookie }));

    expect(adminSession.user.name).toBe("account-40166316");
  });
});

describe("endAdminSession", () => {
  test("ends Nadav's session, so the same cookie no longer signs in", async () => {
    const auth = createTestAuth(await createTestDatabase());
    const { cookie } = await signInAsGitHubAccount(auth, 40_166_316);

    await endAdminSession(auth, new Headers({ cookie }));

    expect(await auth.api.getSession({ headers: new Headers({ cookie }) })).toBeNull();
  });

  test("redirects to sign-in when there is no session to end", async () => {
    const auth = createTestAuth(await createTestDatabase());

    await expect(endAdminSession(auth, new Headers())).rejects.toHaveProperty(
      "digest",
      "NEXT_REDIRECT;replace;/admin/sign-in;307;",
    );
  });
});
