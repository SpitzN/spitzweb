"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

/**
 * A form's submit button that says what is happening while its Server Action runs, and can't be
 * pressed twice. `pendingLabel` replaces the label until the action finishes or navigates away.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant,
}: {
  children: ReactNode;
  pendingLabel: string;
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending} focusableWhenDisabled>
      {pending ? pendingLabel : children}
    </Button>
  );
}
