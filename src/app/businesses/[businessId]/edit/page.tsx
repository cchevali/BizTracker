import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonStyles } from "@/components/ui/button";
import { updateBusinessAction } from "@/features/businesses/actions/business-actions";
import { BusinessEditorForm } from "@/features/businesses/components/business-editor-form";
import { getBusinessById } from "@/features/businesses/data/business-repository";
import { createBusinessFormValues } from "@/features/businesses/domain/business.types";

type EditPageProps = {
  params: Promise<{
    businessId: string;
  }>;
};

export default async function EditBusinessPage({ params }: EditPageProps) {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);

  if (!business) {
    notFound();
  }

  const action = updateBusinessAction.bind(null, business.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Edit business
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            Update {business.businessName}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted-ink)]">
            Keep the acquisition record current, especially after broker calls, diligence updates, or status changes.
          </p>
        </div>

        <Link
          href={`/businesses/${business.id}`}
          className={buttonStyles({ variant: "ghost" })}
        >
          Back to detail
        </Link>
      </div>

      <BusinessEditorForm
        action={action}
        initialValues={createBusinessFormValues(business)}
        submitLabel="Save changes"
        cancelHref={`/businesses/${business.id}`}
      />
    </main>
  );
}
