/**
 * The light or dark theme (docs/architecture.md, Where state lives). Dark is the default and sets
 * nothing; the light theme is `data-theme="light"` on <html> (tokens.css). A visitor's choice is
 * kept in localStorage. Where storage is unavailable, a choice lasts for the visit and the next
 * visit is dark.
 */

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/** The theme of a first visit, and the one the server renders: it can't read a visitor's storage. */
const DEFAULT_THEME = "dark";

/**
 * The script that applies the stored theme. The root layout inlines it in <head>, so it runs
 * while the browser parses the page, before the first paint, and a visitor who chose light never
 * sees the dark ground first. It is source text because it runs before any bundle loads.
 */
export const APPLY_STORED_THEME_SCRIPT = `try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

/** Reads a stored or applied value as a theme: anything but "light" is the default. */
function asTheme(value: string | null | undefined): Theme {
  return value === "light" ? "light" : DEFAULT_THEME;
}

/** The theme the page shows now. */
export function appliedTheme() {
  return asTheme(document.documentElement.dataset.theme);
}

/** The theme the visitor chose last: the default when there is none, or storage is unavailable. */
export function storedTheme() {
  try {
    return asTheme(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

/** Shows a theme on the page, without keeping it. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
}

/** Keeps a theme for the next visit, when storage allows. */
export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage is unavailable: the choice lasts for this visit.
  }
}
