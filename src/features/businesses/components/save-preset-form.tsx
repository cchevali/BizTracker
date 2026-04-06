"use client";

import { useActionState, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { saveFilterPresetAction } from "../actions/business-actions";
import { initialActionState } from "../domain/business.types";

type SavePresetFormProps = {
  queryJson: string;
};

export function SavePresetForm({ queryJson }: SavePresetFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    saveFilterPresetAction,
    initialActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="query" value={queryJson} />
      <Input
        name="name"
        placeholder="Save current filters as..."
        invalid={Boolean(state.fieldErrors?.name?.[0])}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save preset"}
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
