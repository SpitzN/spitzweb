"use client";

import { Field } from "@base-ui/react/field";
import { Form } from "@base-ui/react/form";
import type { ReactNode } from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <Form
      action={formAction}
      errors={state.status === "invalid" ? state.errors : undefined}
      className="grid gap-6"
    >
      {update ? <input type="hidden" name="id" value={update.id} /> : null}
      <Field.Root name="text" className="grid gap-2">
        <Field.Label className="font-semibold">Update</Field.Label>
        <Textarea rows={3} maxLength={UPDATE_TEXT_MAX_LENGTH} defaultValue={values.text} />
        <Field.Description className="text-ink-muted">
          One or two lines on what you’re doing now, up to {UPDATE_TEXT_MAX_LENGTH} characters.
        </Field.Description>
        <Field.Error className="font-semibold" />
      </Field.Root>
      <Field.Root name="link" className="grid gap-2">
        <Field.Label className="font-semibold">Link (optional)</Field.Label>
        <Input
          // Text rather than url, so the Server Action's message is the only one a bad link gets.
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
          defaultValue={values.link}
        />
        <Field.Description className="text-ink-muted">
          A web address that starts with https://
        </Field.Description>
        <Field.Error className="font-semibold" />
      </Field.Root>
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
