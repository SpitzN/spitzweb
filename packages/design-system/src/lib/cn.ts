import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge knows Tailwind's default type scale only, so it reads `text-title` as a colour
// and drops it beside `text-ink`. The theme's own type sizes (src/styles/tokens.css, --text-*) are
// named here so they merge as font sizes.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["statement", "title"] } },
});

/**
 * Joins class values (strings, conditionals, arrays) into one class string, where a later class
 * replaces an earlier one that sets the same thing. An atom passes its own classes first and the
 * caller's `className` last, so the caller's layout wins.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
