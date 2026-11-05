# Forms on Base UI Form with Server Actions

Admin panel forms are Base UI's `Form` and `Field` (the design system's `atoms/form.tsx` and `atoms/field.tsx`), posting to a Server Action through `useActionState`, not React Hook Form. Base UI wires each field's label, description and error to its control, and `<Form errors>` hands the Server Action's field errors to the field with the same name. The form posts without JavaScript, and none of today's forms needs what a form library adds. React Hook Form also has known friction with the React Compiler (`watch()`, `useFormContext`).

The design system wraps Base UI's `Field`, not shadcn's `Field`: shadcn's is plain `div`s whose label, description and error are wired to the control by hand, which drops both of Base UI's wirings.

## Considered Options

- **React Hook Form**, the form library shadcn's docs pair with: client-side state, so a form doesn't work before JavaScript loads, and the compiler friction above.
- **TanStack Form**: the same trade, for features no form here needs yet.

## Consequences

- Revisit this decision with the first form that needs field arrays, dependent fields or multiple steps. React Hook Form and TanStack Form are the candidates.
- Client-side validation, when it comes, runs the Server Action's own zod schemas through `Field`'s `validate` prop.
