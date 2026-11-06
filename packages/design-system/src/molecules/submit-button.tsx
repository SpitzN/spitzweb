"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@spitzweb/design-system/atoms/button";

/**
 * A form's submit button that says what is happening while its Server Action runs, and can't be
 * pressed twice. `pendingLabel` replaces the label until the action finishes or navigates away.
 * `className` places it, like any design-system component's.
 */
export function SubmitButton({
  children,
  className,
  pendingLabel,
  variant,
}: {
  children: ReactNode;
  className?: string | undefined;
  pendingLabel: string;
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      disabled={pending}
      focusableWhenDisabled
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
