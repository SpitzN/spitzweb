import { describe, expect, test } from "vitest";
import { endAdminSession } from "@/admin/server/admin-session";
import { createTestAuth, createTestDatabase, signInAsGitHubAccount } from "@/lib/test-auth";

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
