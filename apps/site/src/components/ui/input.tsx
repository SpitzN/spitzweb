import { Input as InputPrimitive } from "@base-ui/react/input";

// shadcn/ui's Input on Base UI, mapped onto the DESIGN.md tokens (ADR 0010). Inside a Base UI
// Field it is the field's control, so its label, description and error are wired to it. A hairline
// frame that firms to muted ink under pointer and to ink when the field is invalid; 44 px tall,
// the Admin panel's target (.claude/rules/ui.md).
export function Input(props: Omit<InputPrimitive.Props, "className">) {
  return (
    <InputPrimitive
      className="border border-rule bg-ground px-3 text-ink transition-colors inline-full min-block-11 hover:border-ink-muted data-invalid:border-ink"
      {...props}
    />
  );
}
