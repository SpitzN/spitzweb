import { expect, test } from "vitest";
import { focusOf, listKeyAction } from "@/entry-types/projects/list-selection";

const atRest = { code: "", isModified: false, focus: "nothing", count: 4 } as const;

test("J moves the selection to the next row", () => {
  expect(listKeyAction({ ...atRest, key: "j", selected: 1 })).toStrictEqual({
    kind: "select",
    index: 2,
  });
});

test("K moves the selection to the previous row", () => {
  expect(listKeyAction({ ...atRest, key: "k", selected: 2 })).toStrictEqual({
    kind: "select",
    index: 1,
  });
});

test("the selection stops at the first and the last row rather than wrapping", () => {
  expect(listKeyAction({ ...atRest, key: "k", selected: 0 })).toStrictEqual({
    kind: "select",
    index: 0,
  });
  expect(listKeyAction({ ...atRest, key: "j", selected: 3 })).toStrictEqual({
    kind: "select",
    index: 3,
  });
});

test("Enter opens the selected row when nothing has focus", () => {
  expect(listKeyAction({ ...atRest, key: "Enter", selected: 2 })).toStrictEqual({
    kind: "open",
    index: 2,
  });
});

test("Enter is left to whatever has focus, such as a link, which opens itself", () => {
  expect(
    listKeyAction({ ...atRest, key: "Enter", focus: "elsewhere", selected: 2 }),
  ).toBeUndefined();
});

test.each(["j", "k", "Enter"])(
  "%s does nothing while a text field has focus, so it can be typed",
  (key) => {
    expect(listKeyAction({ ...atRest, key, focus: "text-field", selected: 1 })).toBeUndefined();
  },
);

test("the keys do nothing with Control, Alt or Meta held, so browser shortcuts still work", () => {
  expect(listKeyAction({ ...atRest, key: "j", isModified: true, selected: 1 })).toBeUndefined();
});

test("J and K work with Shift or Caps Lock on", () => {
  expect(listKeyAction({ ...atRest, key: "J", code: "KeyJ", selected: 1 })).toStrictEqual({
    kind: "select",
    index: 2,
  });
  expect(listKeyAction({ ...atRest, key: "K", code: "KeyK", selected: 1 })).toStrictEqual({
    kind: "select",
    index: 0,
  });
});

test("J and K work by their place on the keyboard when the layout isn't Latin", () => {
  // On a Hebrew layout the J key types ח and the K key types ל.
  expect(listKeyAction({ ...atRest, key: "ח", code: "KeyJ", selected: 1 })).toStrictEqual({
    kind: "select",
    index: 2,
  });
  expect(listKeyAction({ ...atRest, key: "ל", code: "KeyK", selected: 1 })).toStrictEqual({
    kind: "select",
    index: 0,
  });
});

test("the keys do nothing in an empty list", () => {
  expect(listKeyAction({ ...atRest, key: "j", count: 0, selected: 0 })).toBeUndefined();
});

// An element as `document.activeElement` reports it: the tag name is upper-case.
function element(tagName: string, more: { type?: string; isContentEditable?: boolean } = {}) {
  return { tagName, type: "", isContentEditable: false, ...more };
}

test("nothing has focus when the page itself, or no element, is active", () => {
  expect(focusOf(null)).toBe("nothing");
  expect(focusOf(element("BODY"))).toBe("nothing");
});

test("text inputs, text areas, selects and editable regions are text fields", () => {
  expect(focusOf(element("INPUT", { type: "text" }))).toBe("text-field");
  expect(focusOf(element("INPUT", { type: "search" }))).toBe("text-field");
  expect(focusOf(element("TEXTAREA"))).toBe("text-field");
  expect(focusOf(element("SELECT"))).toBe("text-field");
  expect(focusOf(element("DIV", { isContentEditable: true }))).toBe("text-field");
});

test("links, buttons and inputs that take no typing are focused elsewhere", () => {
  expect(focusOf(element("A"))).toBe("elsewhere");
  expect(focusOf(element("BUTTON"))).toBe("elsewhere");
  expect(focusOf(element("INPUT", { type: "checkbox" }))).toBe("elsewhere");
});
