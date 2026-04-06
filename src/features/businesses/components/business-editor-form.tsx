"use client";

import Link from "next/link";
import { useActionState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  dealStatusOptions,
  initialActionState,
  ratingOptions,
  type ActionState,
  type BusinessFormValues,
} from "../domain/business.types";

type BusinessEditorFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues: BusinessFormValues;
  submitLabel: string;
  cancelHref: string;
};

export function BusinessEditorForm({
  action,
  initialValues,
  submitLabel,
  cancelHref,
}: BusinessEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const errors = state.fieldErrors ?? {};

  const errorFor = (field: keyof BusinessFormValues) => errors[field]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message ? (
        <Panel className="border-[#e8c2bc] bg-[#fff6f4] px-5 py-4">
          <p className="text-sm text-[#8f3d2e]">{state.message}</p>
        </Panel>
      ) : null}

      <fieldset disabled={pending} className="space-y-6 disabled:opacity-80">
        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Business basics
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                This is the durable profile future sessions will use as the primary acquisition record.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Business name" error={errorFor("businessName")}>
                <Input
                  name="businessName"
                  defaultValue={initialValues.businessName}
                  invalid={Boolean(errorFor("businessName"))}
                />
              </FormField>

              <FormField
                label="Source URL"
                hint="Codex chat or listing URL"
                error={errorFor("sourceUrl")}
              >
                <Input
                  name="sourceUrl"
                  defaultValue={initialValues.sourceUrl}
                  placeholder="https://..."
                  invalid={Boolean(errorFor("sourceUrl"))}
                />
              </FormField>

              <FormField label="Category" error={errorFor("category")}>
                <Input
                  name="category"
                  defaultValue={initialValues.category}
                  invalid={Boolean(errorFor("category"))}
                />
              </FormField>

              <FormField label="Subcategory" error={errorFor("subcategory")}>
                <Input
                  name="subcategory"
                  defaultValue={initialValues.subcategory}
                  invalid={Boolean(errorFor("subcategory"))}
                />
              </FormField>

              <FormField label="Location" error={errorFor("location")}>
                <Input
                  name="location"
                  defaultValue={initialValues.location}
                  placeholder="City, ST"
                  invalid={Boolean(errorFor("location"))}
                />
              </FormField>

              <FormField
                label="State code"
                hint="Two letters"
                error={errorFor("stateCode")}
              >
                <Input
                  name="stateCode"
                  defaultValue={initialValues.stateCode}
                  maxLength={2}
                  invalid={Boolean(errorFor("stateCode"))}
                />
              </FormField>

              <FormField label="Broker name" error={errorFor("brokerName")}>
                <Input
                  name="brokerName"
                  defaultValue={initialValues.brokerName}
                  invalid={Boolean(errorFor("brokerName"))}
                />
              </FormField>

              <FormField label="Broker firm" error={errorFor("brokerFirm")}>
                <Input
                  name="brokerFirm"
                  defaultValue={initialValues.brokerFirm}
                  invalid={Boolean(errorFor("brokerFirm"))}
                />
              </FormField>

              <FormField label="Listing source" error={errorFor("listingSource")}>
                <Input
                  name="listingSource"
                  defaultValue={initialValues.listingSource}
                  invalid={Boolean(errorFor("listingSource"))}
                />
              </FormField>

              <FormField label="Deal status" error={errorFor("dealStatus")}>
                <Select
                  name="dealStatus"
                  defaultValue={initialValues.dealStatus}
                  invalid={Boolean(errorFor("dealStatus"))}
                >
                  {dealStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField
              label="Summary"
              error={errorFor("summary")}
              hint="Short, factual overview"
            >
              <Textarea
                name="summary"
                defaultValue={initialValues.summary}
                invalid={Boolean(errorFor("summary"))}
              />
            </FormField>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Financial snapshot
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Use whole-dollar values. Leave fields blank when the source does not provide them.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField label="Asking price" error={errorFor("askingPrice")}>
                <Input
                  name="askingPrice"
                  inputMode="decimal"
                  defaultValue={initialValues.askingPrice}
                  invalid={Boolean(errorFor("askingPrice"))}
                />
              </FormField>

              <FormField label="Revenue" error={errorFor("revenue")}>
                <Input
                  name="revenue"
                  inputMode="decimal"
                  defaultValue={initialValues.revenue}
                  invalid={Boolean(errorFor("revenue"))}
                />
              </FormField>

              <FormField label="SDE" error={errorFor("sde")}>
                <Input
                  name="sde"
                  inputMode="decimal"
                  defaultValue={initialValues.sde}
                  invalid={Boolean(errorFor("sde"))}
                />
              </FormField>

              <FormField label="EBITDA" error={errorFor("ebitda")}>
                <Input
                  name="ebitda"
                  inputMode="decimal"
                  defaultValue={initialValues.ebitda}
                  invalid={Boolean(errorFor("ebitda"))}
                />
              </FormField>

              <FormField label="Employees" error={errorFor("employees")}>
                <Input
                  name="employees"
                  inputMode="numeric"
                  defaultValue={initialValues.employees}
                  invalid={Boolean(errorFor("employees"))}
                />
              </FormField>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Fit assessment
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Ratings can be left blank. If enough ratings are present and no overall score is set, the score is derived automatically with owner dependence treated as a negative factor.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Why it may fit" error={errorFor("whyItMayFit")}>
                <Textarea
                  name="whyItMayFit"
                  defaultValue={initialValues.whyItMayFit}
                  invalid={Boolean(errorFor("whyItMayFit"))}
                />
              </FormField>

              <FormField label="Risks / why it may fail" error={errorFor("risks")}>
                <Textarea
                  name="risks"
                  defaultValue={initialValues.risks}
                  invalid={Boolean(errorFor("risks"))}
                />
              </FormField>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Owner dependence rating"
                hint="1 low, 5 high"
                error={errorFor("ownerDependenceRating")}
              >
                <Select
                  name="ownerDependenceRating"
                  defaultValue={initialValues.ownerDependenceRating}
                  invalid={Boolean(errorFor("ownerDependenceRating"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Recurring revenue rating"
                hint="1 low, 5 high"
                error={errorFor("recurringRevenueRating")}
              >
                <Select
                  name="recurringRevenueRating"
                  defaultValue={initialValues.recurringRevenueRating}
                  invalid={Boolean(errorFor("recurringRevenueRating"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Transferability rating"
                hint="1 low, 5 high"
                error={errorFor("transferabilityRating")}
              >
                <Select
                  name="transferabilityRating"
                  defaultValue={initialValues.transferabilityRating}
                  invalid={Boolean(errorFor("transferabilityRating"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Schedule-control fit rating"
                hint="1 low, 5 high"
                error={errorFor("scheduleControlFitRating")}
              >
                <Select
                  name="scheduleControlFitRating"
                  defaultValue={initialValues.scheduleControlFitRating}
                  invalid={Boolean(errorFor("scheduleControlFitRating"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Brother-operator fit rating"
                hint="1 low, 5 high"
                error={errorFor("brotherOperatorFitRating")}
              >
                <Select
                  name="brotherOperatorFitRating"
                  defaultValue={initialValues.brotherOperatorFitRating}
                  invalid={Boolean(errorFor("brotherOperatorFitRating"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Overall score" error={errorFor("overallScore")}>
                <Input
                  name="overallScore"
                  inputMode="numeric"
                  defaultValue={initialValues.overallScore}
                  invalid={Boolean(errorFor("overallScore"))}
                />
              </FormField>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Notes and labels
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Use tags for fast filtering and notes for durable diligence context.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Tags"
                hint="Comma separated"
                error={errorFor("tags")}
              >
                <Input
                  name="tags"
                  defaultValue={initialValues.tags}
                  placeholder="recurring, b2b, southeast"
                  invalid={Boolean(errorFor("tags"))}
                />
              </FormField>

              <FormField label="Notes" error={errorFor("notes")}>
                <Textarea
                  name="notes"
                  defaultValue={initialValues.notes}
                  invalid={Boolean(errorFor("notes"))}
                />
              </FormField>
            </div>
          </div>
        </Panel>
      </fieldset>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href={cancelHref} className={buttonStyles({ variant: "ghost" })}>
          Cancel
        </Link>
        <button
          type="submit"
          formAction={formAction}
          className={buttonStyles({ variant: "primary" })}
          disabled={pending}
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
