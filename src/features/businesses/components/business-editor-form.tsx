"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";

import { calculateBusinessScenario } from "../domain/business-scenario";
import {
  dealStatusOptions,
  initialActionState,
  nullableBooleanOptions,
  primaryUseCaseOptions,
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

type ScenarioMetricProps = {
  label: string;
  value: string;
};

function ScenarioMetric({ label, value }: ScenarioMetricProps) {
  return (
    <div className="rounded-[22px] bg-[var(--color-panel-muted)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted-ink)]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}

function parseCurrencyInput(value: string) {
  const normalized = value.replace(/[$,\s]/g, "").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function BusinessEditorForm({
  action,
  initialValues,
  submitLabel,
  cancelHref,
}: BusinessEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [askingPriceValue, setAskingPriceValue] = useState(
    parseCurrencyInput(initialValues.askingPrice),
  );
  const [sdeValue, setSdeValue] = useState(parseCurrencyInput(initialValues.sde));
  const errors = state.fieldErrors ?? {};

  const scenario = calculateBusinessScenario({
    askingPrice: askingPriceValue,
    sde: sdeValue,
  });

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
                  onChange={(event) =>
                    setAskingPriceValue(parseCurrencyInput(event.target.value))
                  }
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
                  onChange={(event) =>
                    setSdeValue(parseCurrencyInput(event.target.value))
                  }
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
                Legacy fit assessment
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                These are the original tracker fields. The new thesis sections below add more targeted screening without reinterpreting the historical overall score.
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
                Investment thesis
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Keep the bridge-while-employed lane separate from the eventual full-time replacement lane.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="AI resistance score"
                hint="5 = more resilient"
                error={errorFor("aiResistanceScore")}
              >
                <Select
                  name="aiResistanceScore"
                  defaultValue={initialValues.aiResistanceScore}
                  invalid={Boolean(errorFor("aiResistanceScore"))}
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
                label="Keep-day-job fit"
                hint="Owner keeps job; brother runs ops"
                error={errorFor("keepDayJobFit")}
              >
                <Select
                  name="keepDayJobFit"
                  defaultValue={initialValues.keepDayJobFit}
                  invalid={Boolean(errorFor("keepDayJobFit"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
                <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                  Can this realistically be owned while keeping a full-time job, with brother handling day-to-day operations?
                </p>
              </FormField>

              <FormField
                label="Quit-day-job fit"
                hint="Could it replace owner comp?"
                error={errorFor("quitDayJobFit")}
              >
                <Select
                  name="quitDayJobFit"
                  defaultValue={initialValues.quitDayJobFit}
                  invalid={Boolean(errorFor("quitDayJobFit"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
                <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                  Could this realistically justify leaving the day job if performance is real and transferable?
                </p>
              </FormField>

              <FormField
                label="Primary use case"
                error={errorFor("primaryUseCase")}
              >
                <Select
                  name="primaryUseCase"
                  defaultValue={initialValues.primaryUseCase}
                  invalid={Boolean(errorFor("primaryUseCase"))}
                >
                  <option value="">Not set</option>
                  {primaryUseCaseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Beats current benchmark?"
                error={errorFor("beatsCurrentBenchmark")}
              >
                <Select
                  name="beatsCurrentBenchmark"
                  defaultValue={initialValues.beatsCurrentBenchmark}
                  invalid={Boolean(errorFor("beatsCurrentBenchmark"))}
                >
                  {nullableBooleanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField
              label="Benchmark notes"
              hint="Use benchmark-specific comparison notes"
              error={errorFor("benchmarkNotes")}
            >
              <Textarea
                name="benchmarkNotes"
                defaultValue={initialValues.benchmarkNotes}
                invalid={Boolean(errorFor("benchmarkNotes"))}
              />
              <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                Use this to compare against the current benchmark for the relevant use case, not for generic commentary.
              </p>
            </FormField>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Financeability and closing
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                The read-only scenario below uses the shared conservative assumptions for close cash, debt service, and paying brother.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Financeability rating"
                hint="5 = easiest to finance"
                error={errorFor("financeabilityRating")}
              >
                <Select
                  name="financeabilityRating"
                  defaultValue={initialValues.financeabilityRating}
                  invalid={Boolean(errorFor("financeabilityRating"))}
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
                label="Seller financing available?"
                error={errorFor("sellerFinancingAvailable")}
              >
                <Select
                  name="sellerFinancingAvailable"
                  defaultValue={initialValues.sellerFinancingAvailable}
                  invalid={Boolean(errorFor("sellerFinancingAvailable"))}
                >
                  {nullableBooleanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField
              label="Seller financing notes"
              error={errorFor("sellerFinancingNotes")}
            >
              <Textarea
                name="sellerFinancingNotes"
                defaultValue={initialValues.sellerFinancingNotes}
                invalid={Boolean(errorFor("sellerFinancingNotes"))}
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <ScenarioMetric
                label="Cash to close low"
                value={formatCurrency(scenario.cashToCloseLow)}
              />
              <ScenarioMetric
                label="Cash to close high"
                value={formatCurrency(scenario.cashToCloseHigh)}
              />
              <ScenarioMetric
                label="Annual debt service"
                value={formatCurrency(scenario.annualDebtServiceAssumed)}
              />
              <ScenarioMetric
                label="Paper cash after brother"
                value={formatCurrency(scenario.paperCashAfterBrother)}
              />
              <ScenarioMetric
                label="Conservative cash after brother"
                value={formatCurrency(scenario.conservativeCashAfterBrother)}
              />
            </div>

            <FormField
              label="Cash-to-close notes"
              error={errorFor("cashToCloseNotes")}
            >
              <Textarea
                name="cashToCloseNotes"
                defaultValue={initialValues.cashToCloseNotes}
                invalid={Boolean(errorFor("cashToCloseNotes"))}
              />
              <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                Use this for commentary about why the estimated close-cash range may be too optimistic or pessimistic.
              </p>
            </FormField>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Operational reality
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Focus on how procedural, transferable, and interrupt-driven the day-to-day operations are.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Operator skill dependency"
                hint="1 procedural, 5 expertise-heavy"
                error={errorFor("operatorSkillDependency")}
              >
                <Select
                  name="operatorSkillDependency"
                  defaultValue={initialValues.operatorSkillDependency}
                  invalid={Boolean(errorFor("operatorSkillDependency"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
                <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                  How much does this depend on seller-specific technical judgment or hard-to-transfer know-how?
                </p>
              </FormField>

              <FormField
                label="License dependency"
                hint="1 low, 5 high"
                error={errorFor("licenseDependency")}
              >
                <Select
                  name="licenseDependency"
                  defaultValue={initialValues.licenseDependency}
                  invalid={Boolean(errorFor("licenseDependency"))}
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
                label="After-hours burden"
                hint="1 low, 5 high"
                error={errorFor("afterHoursBurden")}
              >
                <Select
                  name="afterHoursBurden"
                  defaultValue={initialValues.afterHoursBurden}
                  invalid={Boolean(errorFor("afterHoursBurden"))}
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
                label="Capex risk"
                hint="1 low, 5 high"
                error={errorFor("capexRisk")}
              >
                <Select
                  name="capexRisk"
                  defaultValue={initialValues.capexRisk}
                  invalid={Boolean(errorFor("capexRisk"))}
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
                label="Home-based?"
                error={errorFor("homeBasedFlag")}
              >
                <Select
                  name="homeBasedFlag"
                  defaultValue={initialValues.homeBasedFlag}
                  invalid={Boolean(errorFor("homeBasedFlag"))}
                >
                  {nullableBooleanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Recurring revenue percent"
                hint="0 to 100"
                error={errorFor("recurringRevenuePercent")}
              >
                <Input
                  name="recurringRevenuePercent"
                  inputMode="decimal"
                  defaultValue={initialValues.recurringRevenuePercent}
                  invalid={Boolean(errorFor("recurringRevenuePercent"))}
                />
              </FormField>

              <FormField
                label="Owner hours claimed"
                hint="Hours per week"
                error={errorFor("ownerHoursClaimed")}
              >
                <Input
                  name="ownerHoursClaimed"
                  inputMode="numeric"
                  defaultValue={initialValues.ownerHoursClaimed}
                  invalid={Boolean(errorFor("ownerHoursClaimed"))}
                />
              </FormField>

              <FormField
                label="Ops manager exists?"
                error={errorFor("opsManagerExists")}
              >
                <Select
                  name="opsManagerExists"
                  defaultValue={initialValues.opsManagerExists}
                  invalid={Boolean(errorFor("opsManagerExists"))}
                >
                  {nullableBooleanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Key-person risk"
                hint="1 low, 5 high"
                error={errorFor("keyPersonRisk")}
              >
                <Select
                  name="keyPersonRisk"
                  defaultValue={initialValues.keyPersonRisk}
                  invalid={Boolean(errorFor("keyPersonRisk"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                Confidence, freshness, and downside
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
                Use these to stay skeptical when a listing looks good but the evidence is thin or the downside is ugly.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                label="Regret-if-wrong score"
                hint="5 = lower-regret mistake"
                error={errorFor("regretIfWrongScore")}
              >
                <Select
                  name="regretIfWrongScore"
                  defaultValue={initialValues.regretIfWrongScore}
                  invalid={Boolean(errorFor("regretIfWrongScore"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
                <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                  If this deal underperforms, how survivable or low-regret is the mistake?
                </p>
              </FormField>

              <FormField
                label="Data confidence score"
                hint="5 = most credible"
                error={errorFor("dataConfidenceScore")}
              >
                <Select
                  name="dataConfidenceScore"
                  defaultValue={initialValues.dataConfidenceScore}
                  invalid={Boolean(errorFor("dataConfidenceScore"))}
                >
                  <option value="">Not set</option>
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Select>
                <p className="text-xs leading-5 text-[var(--color-muted-ink)]">
                  How much do we trust the freshness and credibility of the listing&apos;s claims?
                </p>
              </FormField>

              <FormField
                label="Stale listing risk"
                hint="1 recent, 5 stale"
                error={errorFor("staleListingRisk")}
              >
                <Select
                  name="staleListingRisk"
                  defaultValue={initialValues.staleListingRisk}
                  invalid={Boolean(errorFor("staleListingRisk"))}
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
                label="Freshness verified at"
                error={errorFor("freshnessVerifiedAt")}
              >
                <Input
                  name="freshnessVerifiedAt"
                  type="datetime-local"
                  defaultValue={initialValues.freshnessVerifiedAt}
                  invalid={Boolean(errorFor("freshnessVerifiedAt"))}
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
                  placeholder="recurring, home-services, b2b"
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
