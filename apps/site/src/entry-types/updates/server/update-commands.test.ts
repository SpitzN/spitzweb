import { describe, expect, test } from "vitest";
import { deleteUpdate, editUpdate, postUpdate } from "@/entry-types/updates/server/update-commands";
import { latestUpdate, listUpdates } from "@/entry-types/updates/server/updates";
import { createTestAuth, createTestDatabase, signInAsGitHubAccount } from "@/lib/test-auth";

// The insecure protocol on its own, so these links are written as plain http on purpose.
const INSECURE = "http:";

function formDataOf(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) formData.set(name, value);
  return formData;
}

async function signedOutRequest() {
  const db = await createTestDatabase();
  return { db, auth: createTestAuth(db), requestHeaders: new Headers() };
}

async function nadavsRequest() {
  const db = await createTestDatabase();
  const auth = createTestAuth(db);
  const { cookie } = await signInAsGitHubAccount(auth, 40_166_316);
  return { db, auth, requestHeaders: new Headers({ cookie }) };
}

describe("postUpdate", () => {
  test("posts Nadav's Update, which becomes the latest", async () => {
    const request = await nadavsRequest();

    const result = await postUpdate(
      request,
      formDataOf({ text: "Rebuilding this site.", link: "https://github.com/SpitzN/spitzweb" }),
    );

    expect(result).toStrictEqual({ ok: true });
    expect(await latestUpdate(request.db)).toMatchObject({
      text: "Rebuilding this site.",
      link: "https://github.com/SpitzN/spitzweb",
      editedAt: null,
    });
  });

  test("posts an Update without a link when the link is left empty", async () => {
    const request = await nadavsRequest();

    await postUpdate(request, formDataOf({ text: "Rebuilding this site.", link: "" }));

    expect(await latestUpdate(request.db)).toMatchObject({ link: null });
  });

  test("an empty Update is turned back with an error on its text, and nothing is posted", async () => {
    const request = await nadavsRequest();

    const result = await postUpdate(request, formDataOf({ text: " \t\n", link: "" }));

    expect(result).toStrictEqual({
      ok: false,
      error: { text: "Write what you’re doing." },
    });
    expect(await listUpdates(request.db)).toStrictEqual([]);
  });

  test("an Update longer than 280 characters is turned back", async () => {
    const request = await nadavsRequest();

    const result = await postUpdate(request, formDataOf({ text: "a".repeat(281) }));

    expect(result).toStrictEqual({
      ok: false,
      error: { text: "Keep it to 280 characters." },
    });
  });

  test("line breaks and repeated spaces in the text become single spaces", async () => {
    const request = await nadavsRequest();

    await postUpdate(request, formDataOf({ text: "\tRebuilding\n\nthis \tsite.\n" }));

    expect(await latestUpdate(request.db)).toMatchObject({ text: "Rebuilding this site." });
  });

  // Security invariant (docs/conventions.md): a user-supplied link is accepted only with https:.
  test.each([
    `${INSECURE}//example.com`,
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "ftp://example.com/file",
    "//example.com",
    "example.com",
    "https://",
  ])("the link %s is turned back with an error on the link", async (link) => {
    const request = await nadavsRequest();

    const result = await postUpdate(request, formDataOf({ text: "Rebuilding this site.", link }));

    expect(result).toStrictEqual({
      ok: false,
      error: { link: "Use a link that starts with https://" },
    });
    expect(await listUpdates(request.db)).toStrictEqual([]);
  });

  test("redirects to sign-in without a session, and posts nothing", async () => {
    const request = await signedOutRequest();

    await expect(
      postUpdate(request, formDataOf({ text: "Rebuilding this site." })),
    ).rejects.toHaveProperty("digest", "NEXT_REDIRECT;replace;/admin/sign-in;307;");
    expect(await listUpdates(request.db)).toStrictEqual([]);
  });
});

async function postedUpdate(request: Awaited<ReturnType<typeof nadavsRequest>>, text: string) {
  await postUpdate(request, formDataOf({ text }));
  const posted = await latestUpdate(request.db);
  if (!posted) throw new Error("The Update wasn't posted.");
  return posted;
}

describe("editUpdate", () => {
  test("changes the text and link, marks it edited, and keeps when it was posted", async () => {
    const request = await nadavsRequest();
    const posted = await postedUpdate(request, "Rebuilding this site.");

    const result = await editUpdate(
      request,
      formDataOf({ id: posted.id, text: "Shipping Updates.", link: "https://spitzweb.dev" }),
    );

    expect(result).toStrictEqual({ ok: true });
    const [edited] = await listUpdates(request.db);
    expect(edited).toMatchObject({
      id: posted.id,
      text: "Shipping Updates.",
      link: "https://spitzweb.dev",
      postedAt: posted.postedAt,
    });
    expect(edited?.editedAt).toBeInstanceOf(Date);
  });

  test("bad input is turned back and the Update stays as it was", async () => {
    const request = await nadavsRequest();
    const posted = await postedUpdate(request, "Rebuilding this site.");

    const result = await editUpdate(
      request,
      formDataOf({ id: posted.id, text: "Shipping Updates.", link: `${INSECURE}//spitzweb.dev` }),
    );

    expect(result).toStrictEqual({
      ok: false,
      error: { link: "Use a link that starts with https://" },
    });
    expect(await latestUpdate(request.db)).toStrictEqual(posted);
  });

  test("an Update that no longer exists is a 404", async () => {
    const request = await nadavsRequest();

    await expect(
      editUpdate(
        request,
        formDataOf({ id: "00000000-0000-4000-8000-000000000000", text: "Shipping Updates." }),
      ),
    ).rejects.toHaveProperty("digest", "NEXT_HTTP_ERROR_FALLBACK;404");
  });

  test("redirects to sign-in without a session, and changes nothing", async () => {
    const request = await nadavsRequest();
    const posted = await postedUpdate(request, "Rebuilding this site.");
    const signedOut = { ...request, requestHeaders: new Headers() };

    await expect(
      editUpdate(signedOut, formDataOf({ id: posted.id, text: "Shipping Updates." })),
    ).rejects.toHaveProperty("digest", "NEXT_REDIRECT;replace;/admin/sign-in;307;");
    expect(await latestUpdate(request.db)).toStrictEqual(posted);
  });
});

describe("deleteUpdate", () => {
  test("deletes the Update, so the one posted before it is the latest again", async () => {
    const request = await nadavsRequest();
    const earlier = await postedUpdate(request, "Rebuilding this site.");
    const later = await postedUpdate(request, "Shipping Updates.");

    await deleteUpdate(request, formDataOf({ id: later.id }));

    expect(await listUpdates(request.db)).toStrictEqual([earlier]);
  });

  test("redirects to sign-in without a session, and deletes nothing", async () => {
    const request = await nadavsRequest();
    const posted = await postedUpdate(request, "Rebuilding this site.");
    const signedOut = { ...request, requestHeaders: new Headers() };

    await expect(deleteUpdate(signedOut, formDataOf({ id: posted.id }))).rejects.toHaveProperty(
      "digest",
      "NEXT_REDIRECT;replace;/admin/sign-in;307;",
    );
    expect(await listUpdates(request.db)).toStrictEqual([posted]);
  });
});
