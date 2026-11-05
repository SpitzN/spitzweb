import { Form as FormPrimitive } from "@base-ui/react/form";
import { cn } from "@spitzweb/design-system/lib/cn";

/**
 * Base UI's Form, which posts to its `action` (a Server Action through `useActionState`) and hands
 * each `Field` its error from `errors` by the field's name (ADR 0015). Its fields stack with the
 * Admin panel's field spacing; `className` only places it.
 */
export function Form({
  className,
  ...props
}: Omit<FormPrimitive.Props, "className"> & { className?: string }) {
  return <FormPrimitive data-slot="form" className={cn("grid gap-6", className)} {...props} />;
}
