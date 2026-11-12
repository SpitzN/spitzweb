"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import {
  appliedTheme,
  applyTheme,
  chooseTheme,
  defaultTheme,
  storedTheme,
  subscribeToTheme,
} from "@/lib/theme";

/**
 * The header's theme switch: Dark and Light, with the theme in use in heavier ink (DESIGN.md,
 * Navigation). Its look follows <html> through the `light:` variant, so it is right from the
 * first paint; `aria-pressed` follows once the page hydrates. Each label sits over a hidden
 * semibold copy of itself, so a change of weight never moves the pair.
 */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribeToTheme, appliedTheme, defaultTheme);

  // In development, Strict Mode's remount resets <html> to the attributes React renders and drops
  // the one the inline script set. In production the theme is already applied and this changes
  // nothing.
  useLayoutEffect(() => {
    applyTheme(storedTheme());
  }, []);

  return (
    <div role="group" aria-label="Theme" className="flex gap-4">
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => {
          chooseTheme("dark");
        }}
        className="grid cursor-pointer font-semibold text-ink transition-colors min-block-6 min-inline-6 hover:text-ink focus-visible:rounded-xs light:font-normal light:text-ink-muted"
      >
        <span className="col-start-1 row-start-1">Dark</span>
        <span aria-hidden className="invisible col-start-1 row-start-1 font-semibold">
          Dark
        </span>
      </button>
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => {
          chooseTheme("light");
        }}
        className="grid cursor-pointer text-ink-muted transition-colors min-block-6 min-inline-6 hover:text-ink focus-visible:rounded-xs light:font-semibold light:text-ink"
      >
        <span className="col-start-1 row-start-1">Light</span>
        <span aria-hidden className="invisible col-start-1 row-start-1 font-semibold">
          Light
        </span>
      </button>
    </div>
  );
}
