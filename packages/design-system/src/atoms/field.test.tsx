import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Field, FieldLabel } from "@spitzweb/design-system/atoms/field";
import { Input } from "@spitzweb/design-system/atoms/input";
import { Textarea } from "@spitzweb/design-system/atoms/textarea";

// A Field wires its label and name only to a Base UI control (ADR 0015), so each control is
// checked inside a real Field. A plain <textarea> in place of Textarea fails both tests.

/** The attributes of the first `<tag>` in the markup, by name. */
function attributesOf(markup: string, tag: string) {
  const element = new RegExp(String.raw`<${tag}(?:\s[^>]*)?>`).exec(markup)?.[0] ?? "";
  return new Map(
    element
      .matchAll(/\s([\w-]+)="([^"]*)"/g)
      .map(([, name = "", value = ""]) => [name.toLowerCase(), value]),
  );
}

describe.each([
  { tag: "input", control: <Input defaultValue="https://example.com" maxLength={200} /> },
  { tag: "textarea", control: <Textarea defaultValue="Shipping" maxLength={280} rows={3} /> },
])("a <$tag> inside a Field", ({ tag, control }) => {
  const markup = renderToStaticMarkup(
    <Field name="text">
      <FieldLabel>Label</FieldLabel>
      {control}
    </Field>,
  );
  const attributes = attributesOf(markup, tag);

  test("is named by the field's label", () => {
    expect(attributes.get("id")).toBeTruthy();
    expect(attributesOf(markup, "label").get("for")).toBe(attributes.get("id"));
  });

  test("submits under the field's name and keeps its own attributes", () => {
    expect(attributes.get("name")).toBe("text");
    expect(attributes.get("maxlength")).toMatch(/^\d+$/);
  });
});

test("a Textarea keeps its rows and starting text", () => {
  const markup = renderToStaticMarkup(<Textarea defaultValue="Shipping" rows={3} />);
  expect(attributesOf(markup, "textarea").get("rows")).toBe("3");
  expect(markup).toContain(">Shipping</textarea>");
});
