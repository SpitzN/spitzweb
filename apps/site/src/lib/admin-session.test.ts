import { describe, expect, test } from "vitest";
import { requireAdminSession } from "@/lib/admin-session";
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
