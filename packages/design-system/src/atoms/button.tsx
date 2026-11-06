import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "@spitzweb/design-system/lib/cn";

// shadcn/ui's Button on Base UI, with its variants mapped onto the DESIGN.md tokens (ADR 0010).
// The accent never fills a button: it marks only the live or selected thing. Every size meets
// the Admin panel's 44×44 px target (.claude/rules/ui.md). A busy button stays focusable, so Base
// UI marks it with aria-disabled rather than disabled, and the styles key on that.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 px-4 font-semibold whitespace-nowrap transition-colors select-none min-block-11 min-inline-11 aria-disabled:cursor-progress",
  {
    variants: {
      variant: {
        // The one action a screen exists for: an ink fill, which eases to muted ink under pointer
        // and stays muted while it is busy.
        default:
          "bg-ink text-ground hover:not-aria-disabled:bg-ink-muted aria-disabled:bg-ink-muted",
        // A secondary action: a hairline frame, which takes the lifted ground under pointer. Its
        // label turns muted while it is busy.
        outline:
          "border border-rule text-ink hover:not-aria-disabled:bg-ground-raised aria-disabled:text-ink-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/**
 * A button in one of the design system's variants. `className` places it (margin, width, flex
 * and grid placement); its look comes only from `variant`.
 */
export function Button({
  className,
  variant,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
