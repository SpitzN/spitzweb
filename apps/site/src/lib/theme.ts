/**
 * The light or dark theme (docs/architecture.md, Where state lives). Dark is the default and sets
 * nothing; the light theme is `data-theme="light"` on <html> (tokens.css). A visitor's choice is
 * kept in localStorage. Where storage is unavailable, a choice lasts for the visit and the next
 * visit is dark.
 */

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

/**
 * Applies the stored theme. The root layout inlines it in <head>, so it runs while the browser
 * parses the page, before the first paint, and a visitor who chose light never sees the dark
 * ground first. It is a string because it runs before any bundle loads.
 */
export const APPLY_STORED_THEME = `try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

/** The theme the page shows now. */
export function appliedTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** The theme the visitor chose last: dark when there is none, or when storage is unavailable. */
export function storedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Shows a theme on the page, without keeping it. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
}

/**
 * Switches the page to a theme and keeps it for the next visit, when storage allows. Where the
 * browser has view transitions, the old theme crossfades into the new one (globals.css).
 */
export function chooseTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage is unavailable: the choice lasts for this visit.
  }
  if (!("startViewTransition" in document)) {
    applyTheme(theme);
    return;
  }
  document.startViewTransition(() => {
    applyTheme(theme);
  });
}

/** Calls `onChange` whenever the page's theme changes; returns the function that stops it. */
export function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => {
    observer.disconnect();
  };
}
