import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";

// shadcn/ui's Textarea, on Base UI's Input so a Base UI Field wires it up like any control, with
// the Input's frame and states (components/ui/input.tsx). It grows only in the block direction.
export function Textarea({
  rows,
  ...props
}: Omit<InputPrimitive.Props, "className" | "render"> & Pick<ComponentProps<"textarea">, "rows">) {
  return (
    <InputPrimitive
      render={<textarea rows={rows} />}
      className="resize-y border border-rule bg-ground px-3 py-2.5 text-ink transition-colors inline-full hover:border-ink-muted data-invalid:border-ink"
      {...props}
    />
  );
}
