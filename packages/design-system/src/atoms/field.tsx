import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "@spitzweb/design-system/lib/cn";

// Base UI's Field, not shadcn's: shadcn's Field is plain divs whose label, description and error
// are wired to the control by hand. Base UI wires them itself, and takes a field's error from
// <Form errors> by its name (docs/tooling.md, Decisions). Each part keeps the look the Admin
// panel's forms already had; `className` only places it.

/** One form field: label, control, description and error, stacked. `name` matches the form's. */
export function Field({ className, ...props }: FieldPrimitive.Root.Props) {
  return (
    <FieldPrimitive.Root data-slot="field" className={cn("grid gap-2", className)} {...props} />
  );
}

/** The field's label, tied to its control. */
export function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return (
    <FieldPrimitive.Label
      data-slot="field-label"
      className={cn("font-semibold", className)}
      {...props}
    />
  );
}

/** What the field expects, in muted ink; the control is described by it. */
export function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      data-slot="field-description"
      className={cn("text-ink-muted", className)}
      {...props}
    />
  );
}

/** The field's error, shown only while there is one: from the form's `errors`, or validation. */
export function FieldError({ className, ...props }: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      data-slot="field-error"
      className={cn("font-semibold", className)}
      {...props}
    />
  );
}
