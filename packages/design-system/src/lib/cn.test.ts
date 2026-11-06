import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { cn } from "@spitzweb/design-system/lib/cn";

describe("cn", () => {
  test("a caller's layout class wins over the atom's own", () => {
    expect(cn("shrink-0 inline-auto", "inline-full")).toBe("shrink-0 inline-full");
  });

  test("every type size the theme declares survives beside a text colour", () => {
    const tokens = readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8");
    const sizes = tokens
      .matchAll(/^\s*--text-([a-z]+):/gm)
      .map(([, size]) => size)
      .toArray();
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(cn(`text-${size}`, "text-ink")).toBe(`text-${size} text-ink`);
    }
  });

  test("a later text colour still replaces an earlier one", () => {
    expect(cn("text-ink", "text-ink-muted")).toBe("text-ink-muted");
  });
});
