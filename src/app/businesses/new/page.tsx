import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { BusinessEditorForm } from "@/features/businesses/components/business-editor-form";
import { createBusinessAction } from "@/features/businesses/actions/business-actions";
import { createBusinessFormValues } from "@/features/businesses/domain/business.types";

export default function NewBusinessPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            New business
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            Create a durable acquisition record
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted-ink)]">
            Capture the listing facts, fit assessment, and source URL in one place so future sessions can pick up cleanly.
          </p>
        </div>

        <Link href="/" className={buttonStyles({ variant: "ghost" })}>
          Back to dashboard
        </Link>
      </div>

      <BusinessEditorForm
        action={createBusinessAction}
        initialValues={createBusinessFormValues()}
        submitLabel="Create business"
        cancelHref="/"
      />
    </main>
  );
}
