import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@spitzweb/design-system/lib/cn";
import type { LayoutClassNameProps } from "@spitzweb/design-system/lib/layout-class-name";

/**
 * shadcn/ui's Input on Base UI, mapped onto the DESIGN.md tokens (ADR 0010). Inside a `Field` it
 * is the field's control, so its label, description and error are wired to it. A hairline frame
 * that firms to muted ink under pointer and to ink when the field is invalid; 44 px tall, the
 * Admin panel's target (.claude/rules/ui.md). `className` places it and sets its width.
 */
export function Input({ className, ...props }: LayoutClassNameProps<InputPrimitive.Props>) {
  return (
    <InputPrimitive
      data-slot="input"
      className={cn(
        "border border-rule bg-ground px-3 text-ink transition-colors min-block-11 hover:border-ink-muted data-invalid:border-ink",
        className,
      )}
      {...props}
    />
  );
}
