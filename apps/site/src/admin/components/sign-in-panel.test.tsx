import { prerender } from "react-dom/static";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SignInPanel } from "@/admin/components/sign-in-panel";
import { stubAuthEnv, stubPreviewEnv } from "@/lib/test-env";

// Renders the panel through every Suspense boundary, as a request does, once `failureReason`
// (the request's search params) resolves.
async function renderSignInPanel(failureReason: Promise<string | undefined>) {
  const { prelude } = await prerender(<SignInPanel failureReason={failureReason} />);
  return new Response(prelude).text();
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("the Admin panel's sign-in", () => {
  test("offers GitHub sign-in when the deployment has the auth env", async () => {
    stubAuthEnv();

    const html = await renderSignInPanel(Promise.resolve(undefined));

    expect(html).toContain("Sign in with GitHub");
  });

  test("says sign-in isn’t available, with nothing to press, on a deployment without the auth env", async () => {
    stubPreviewEnv();

    const html = await renderSignInPanel(Promise.resolve(undefined));

    expect(html).toContain("Sign-in isn’t available on this deployment.");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<button");
  });

  test("decides once the request arrives, so the build's env never fixes the answer", async () => {
    stubPreviewEnv();
    const request = Promise.withResolvers<string | undefined>();

    // The shell renders on the build's env, then the request arrives on the deployment's.
    const rendering = renderSignInPanel(request.promise);
    await new Promise((resolve) => setTimeout(resolve, 0));
    stubAuthEnv();
    request.resolve(undefined);

    expect(await rendering).toContain("Sign in with GitHub");
  });
});
