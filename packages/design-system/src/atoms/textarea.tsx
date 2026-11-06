import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@spitzweb/design-system/lib/cn";
import type { LayoutClassNameProps } from "@spitzweb/design-system/lib/layout-class-name";

/**
 * shadcn/ui's Textarea, on Base UI's Input so a `Field` wires it up like any control, with the
 * Input's frame and states (atoms/input.tsx). It grows only in the block direction. `className`
 * places it and sets its width.
 */
export function Textarea({
  className,
  rows,
  ...props
}: LayoutClassNameProps<Omit<InputPrimitive.Props, "render">> &
  Pick<ComponentProps<"textarea">, "rows">) {
  return (
    <InputPrimitive
      data-slot="textarea"
      render={<textarea rows={rows} />}
      className={cn(
        "resize-y border border-rule bg-ground px-3 py-2.5 text-ink transition-colors hover:border-ink-muted data-invalid:border-ink",
        className,
      )}
      {...props}
    />
  );
}
