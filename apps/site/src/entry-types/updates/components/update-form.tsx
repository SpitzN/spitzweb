"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@spitzweb/design-system/atoms/field";
import { Form } from "@spitzweb/design-system/atoms/form";
import { Input } from "@spitzweb/design-system/atoms/input";
import { Textarea } from "@spitzweb/design-system/atoms/textarea";
import type { ReactNode } from "react";
import { useActionState } from "react";
import type { updates } from "@/entry-types/updates/schema";
import type { UpdateFormState } from "@/entry-types/updates/server/update-actions";
import { UPDATE_TEXT_MAX_LENGTH } from "@/entry-types/updates/update-text";

const READY: UpdateFormState = { status: "ready" };

type EditedUpdate = Pick<typeof updates.$inferSelect, "id" | "text" | "link">;

// React empties the form after every submission, so a turned-back one is filled in again with
// what was submitted; otherwise the form starts from the Update being edited, or empty.
function fieldValues(state: UpdateFormState, update: EditedUpdate | undefined) {
  return state.status === "invalid" || state.status === "failed"
    ? state.submitted
    : { text: update?.text ?? "", link: update?.link ?? "" };
}

/**
 * The form an Update is posted or edited with: its text and an optional link, each with its error
 * beneath it after a submission the Server Action turned back. `update` fills it for editing and
 * names the Update in a hidden field; `actions` holds the submit button and any way out.
 */
export function UpdateForm({
  action,
  update,
  actions,
}: {
  action: (previous: UpdateFormState, formData: FormData) => Promise<UpdateFormState>;
  update?: EditedUpdate;
  actions: ReactNode;
}) {
  const [state, formAction] = useActionState(action, READY);
  const values = fieldValues(state, update);

  return (
    <Form action={formAction} errors={state.status === "invalid" ? state.errors : undefined}>
      {update ? <input type="hidden" name="id" value={update.id} /> : null}
      <Field name="text">
        <FieldLabel>Update</FieldLabel>
        <Textarea
          className="inline-full"
          rows={3}
          maxLength={UPDATE_TEXT_MAX_LENGTH}
          defaultValue={values.text}
        />
        <FieldDescription>
          One or two lines on what you’re doing now, up to {UPDATE_TEXT_MAX_LENGTH} characters.
        </FieldDescription>
        <FieldError />
      </Field>
      <Field name="link">
        <FieldLabel>Link (optional)</FieldLabel>
        <Input
          className="inline-full"
          // Text rather than url, so the Server Action's message is the only one a bad link gets.
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          defaultValue={values.link}
        />
        <FieldDescription>A web address that starts with https://</FieldDescription>
        <FieldError />
      </Field>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">{actions}</div>
      {state.status === "failed" ? (
        <p role="alert" className="font-semibold">
          {state.message}
        </p>
      ) : null}
      {/* Always rendered, so screen readers hear it when it fills. */}
      <p role="status" className="text-ink-muted">
        {state.status === "posted" ? "Posted. It’s on the home page now." : null}
      </p>
    </Form>
  );
}
