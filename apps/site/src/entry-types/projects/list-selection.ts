/**
 * Where keyboard focus is when a key is pressed: on nothing, in the list itself, in a text field,
 * or on anything else.
 */
type Focus = "nothing" | "list" | "text-field" | "elsewhere";

// Input types that take no typing, so a letter key pressed in one is not text.
const UNTYPED_INPUTS = new Set([
  "button",
  "checkbox",
  "color",
  "file",
  "image",
  "radio",
  "range",
  "reset",
  "submit",
]);

/**
 * The parts of `document.activeElement` that say what kind of thing has focus. Only an HTML
 * element can be editable, and only a form control has a type.
 */
type FocusedElement = Pick<Element, "tagName"> & { isContentEditable?: boolean; type?: string };

/** Where focus is, given `document.activeElement`. A select counts as a text field: it types ahead. */
export function focusOf(active: FocusedElement | null) {
  if (active === null || active.tagName === "BODY") return "nothing";
  if (active.isContentEditable === true || ["TEXTAREA", "SELECT"].includes(active.tagName)) {
    return "text-field";
  }
  if (active.tagName === "INPUT" && !UNTYPED_INPUTS.has(active.type ?? "")) return "text-field";
  return "elsewhere";
}

// A Latin key names its letter in either case, with Shift or Caps Lock on; on a layout that isn't
// Latin, J and K are read by their place on the keyboard.
function letterOf(key: string, code: string) {
  if (/^[a-z]$/i.test(key)) return key.toLowerCase();
  if (code === "KeyJ") return "j";
  if (code === "KeyK") return "k";
  return key;
}

interface ListKey {
  /** `KeyboardEvent.key`: what the key types. */
  key: string;
  /** `KeyboardEvent.code`: where the key is on the keyboard. */
  code: string;
  /** Whether Control, Alt or Meta is held. */
  isModified: boolean;
  focus: Focus;
  /** The index of the selected row. */
  selected: number;
  /** How many rows the list has. */
  count: number;
}

/**
 * What a key press does to a list whose selection J and K move: select another row, open the
 * selected one, or nothing.
 */
export function listKeyAction({ key, code, isModified, focus, selected, count }: ListKey) {
  if (isModified || focus === "text-field" || count === 0) return;
  if (key === "Enter") {
    // In the list, Enter opens the selected row even when the pointer has moved the selection off
    // the focused one. Anything else that has focus handles Enter itself.
    return focus === "nothing" || focus === "list"
      ? ({ kind: "open", index: selected } as const)
      : undefined;
  }
  const letter = letterOf(key, code);
  if (letter === "j") return { kind: "select", index: Math.min(selected + 1, count - 1) } as const;
  if (letter === "k") return { kind: "select", index: Math.max(selected - 1, 0) } as const;
}
