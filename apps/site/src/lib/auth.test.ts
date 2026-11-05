import { describe, expect, test } from "vitest";
import { account, session, user } from "@/lib/auth-schema";
import { createTestAuth, createTestDatabase, signInAsGitHubAccount } from "@/lib/test-auth";

const NADAV_GITHUB_ID = 40_166_316;
const OTHER_GITHUB_ID = 1_234_567;

describe("GitHub sign-in", () => {
  test("Nadav's GitHub account signs in, lands in the Admin panel and has a session", async () => {
    const db = await createTestDatabase();
    const auth = createTestAuth(db);

    const { response, cookie } = await signInAsGitHubAccount(auth, NADAV_GITHUB_ID);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/admin");
    const signedIn = await auth.api.getSession({ headers: new Headers({ cookie }) });
    expect(signedIn?.user.email).toBe("account-40166316@example.com");
  });

  test("any other GitHub account is turned away before a user row is written", async () => {
    const db = await createTestDatabase();
    const auth = createTestAuth(db);

    const { response, cookie } = await signInAsGitHubAccount(auth, OTHER_GITHUB_ID);

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(/^\/admin\/sign-in\?error=not_admin/);
    expect(await db.select().from(user)).toStrictEqual([]);
    expect(await db.select().from(account)).toStrictEqual([]);
    expect(await db.select().from(session)).toStrictEqual([]);
    expect(await auth.api.getSession({ headers: new Headers({ cookie }) })).toBeNull();
  });

  test.each(["sign-up", "sign-in"])("email and password %s is disabled", async (endpoint) => {
    const db = await createTestDatabase();
    const auth = createTestAuth(db);

    const response = await auth.handler(
      new Request(`http://localhost:3000/api/auth/${endpoint}/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "x", email: "x@example.com", password: "password-1234" }),
      }),
    );

    expect(response.ok).toBe(false);
    expect(await db.select().from(user)).toStrictEqual([]);
    expect(await db.select().from(session)).toStrictEqual([]);
  });
});
