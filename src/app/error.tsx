"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-16">
      <Panel className="mx-auto max-w-2xl px-8 py-10 text-center">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f3d2e]">
            Unexpected error
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)]">
            The tracker hit an unexpected issue.
          </h2>
          <p className="text-sm leading-6 text-[var(--color-muted-ink)]">
            The error has been surfaced in the console for debugging. Try the
            page again, and if it persists, inspect the repository handoff docs
            before changing behavior.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Panel>
    </div>
  );
}
