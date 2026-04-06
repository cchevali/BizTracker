"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { initialActionState, type ActionState } from "../domain/business.types";

type NoteFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
};

export function NoteForm({ action }: NoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <Textarea
        name="body"
        placeholder="Add a note about diligence, broker calls, or next questions..."
        invalid={Boolean(state.fieldErrors?.body?.[0])}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Adding..." : "Add note"}
        </Button>
        {state.message ? (
          <p
            className={
              state.status === "error"
                ? "text-xs text-[#8f3d2e]"
                : "text-xs text-[var(--color-accent)]"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
