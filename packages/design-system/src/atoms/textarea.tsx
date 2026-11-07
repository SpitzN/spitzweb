import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@spitzweb/design-system/lib/cn";

/**
 * shadcn/ui's Textarea, with the Input's frame and states (atoms/input.tsx). Base UI has no
 * Textarea, and a `Field` wires up only a Base UI control, so it renders through Base UI's Input.
 * Its props go on the `<textarea>` itself: Base UI types the Input's events for `<input>`. It grows
 * only in the block direction. `className` places it and sets its width.
 */
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <InputPrimitive
      data-slot="textarea"
      className={cn(
        "resize-y border border-rule bg-ground px-3 py-2.5 text-ink transition-colors hover:border-ink-muted data-invalid:border-ink",
        className,
      )}
      render={<textarea {...props} />}
    />
  );
}
