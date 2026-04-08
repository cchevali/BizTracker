import { DealStatus } from "@/generated/prisma/enums";
import { z } from "zod";

import { deriveOverallScoreFromRatings } from "./business-score";
import {
  parseBusinessFilters,
  serializeBusinessFilters,
  splitTags,
} from "./business.filters";
import { primaryUseCaseOptions } from "./business.types";
import type { ActionState } from "./business.types";

const businessFieldNames = [
  "businessName",
  "sourceUrl",
  "category",
  "subcategory",
  "location",
  "stateCode",
  "askingPrice",
  "revenue",
  "sde",
  "ebitda",
  "employees",
  "summary",
  "whyItMayFit",
  "risks",
  "brokerName",
  "brokerFirm",
  "listingSource",
  "dealStatus",
  "ownerDependenceRating",
  "recurringRevenueRating",
  "transferabilityRating",
  "scheduleControlFitRating",
  "brotherOperatorFitRating",
  "aiResistanceScore",
  "keepDayJobFit",
  "quitDayJobFit",
  "primaryUseCase",
  "beatsCurrentBenchmark",
  "benchmarkNotes",
  "financeabilityRating",
  "sellerFinancingAvailable",
  "sellerFinancingNotes",
  "operatorSkillDependency",
  "licenseDependency",
  "afterHoursBurden",
  "capexRisk",
  "regretIfWrongScore",
  "dataConfidenceScore",
  "staleListingRisk",
  "keyPersonRisk",
  "homeBasedFlag",
  "recurringRevenuePercent",
  "ownerHoursClaimed",
  "opsManagerExists",
  "freshnessVerifiedAt",
  "cashToCloseNotes",
  "overallScore",
  "notes",
  "tags",
] as const;

const presetFieldNames = ["name", "query"] as const;
const noteFieldNames = ["body"] as const;
const statusFieldNames = ["dealStatus"] as const;
const primaryUseCaseValues = primaryUseCaseOptions.map((option) => option.value);

function getFormValues<T extends readonly string[]>(formData: FormData, keys: T) {
  return Object.fromEntries(
    keys.map((key) => {
      const value = formData.get(key);
      return [key, typeof value === "string" ? value : ""];
    }),
  ) as Record<T[number], string>;
}

function requiredTextField(label: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

function optionalTextField(label: string, max: number) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value.length > max) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be ${max} characters or fewer.`,
        });
      }
    })
    .transform((value) => (value === "" ? undefined : value));
}

function optionalUrlField(label: string) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      try {
        const parsed = new URL(value);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          ctx.addIssue({
            code: "custom",
            message: `${label} must start with http:// or https://.`,
          });
        }
      } catch {
        ctx.addIssue({
          code: "custom",
          message: `Enter a valid ${label.toLowerCase()}.`,
        });
      }
    })
    .transform((value) => (value === "" ? undefined : value));
}

function optionalNumberField({
  label,
  integer = false,
  min = 0,
  max = 9999999999,
}: {
  label: string;
  integer?: boolean;
  min?: number;
  max?: number;
}) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      const parsed = Number(value.replace(/[$,%\s,]/g, ""));

      if (!Number.isFinite(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: `Enter a valid ${label.toLowerCase()}.`,
        });
        return;
      }

      if (integer && !Number.isInteger(parsed)) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be a whole number.`,
        });
        return;
      }

      if (parsed < min || parsed > max) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be between ${min} and ${max}.`,
        });
      }
    })
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      return Number(value.replace(/[$,%\s,]/g, ""));
    });
}

function optionalBooleanField(label: string) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      if (!["true", "false"].includes(value)) {
        ctx.addIssue({
          code: "custom",
          message: `${label} must be Yes, No, or left blank.`,
        });
      }
    })
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      return value === "true";
    });
}

function optionalDateTimeField(label: string) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      const parsed = new Date(value);

      if (Number.isNaN(parsed.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: `Enter a valid ${label.toLowerCase()}.`,
        });
      }
    })
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      return new Date(value);
    });
}

const businessFormSchema = z
  .object({
    businessName: requiredTextField("Business name", 2, 120),
    sourceUrl: optionalUrlField("Source URL"),
    category: requiredTextField("Category", 2, 80),
    subcategory: optionalTextField("Subcategory", 80),
    location: requiredTextField("Location", 2, 120),
    stateCode: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          return;
        }

        if (value.length !== 2) {
          ctx.addIssue({
            code: "custom",
            message: "State must use a 2-letter code.",
          });
        }
      })
      .transform((value) => (value === "" ? undefined : value.toUpperCase())),
    askingPrice: optionalNumberField({ label: "Asking price" }),
    revenue: optionalNumberField({ label: "Revenue" }),
    sde: optionalNumberField({ label: "SDE" }),
    ebitda: optionalNumberField({ label: "EBITDA" }),
    employees: optionalNumberField({
      label: "Employees",
      integer: true,
      max: 100000,
    }),
    summary: requiredTextField("Summary", 10, 2000),
    whyItMayFit: requiredTextField("Why it may fit", 10, 2000),
    risks: requiredTextField("Risks", 10, 2000),
    brokerName: optionalTextField("Broker name", 120),
    brokerFirm: optionalTextField("Broker firm", 120),
    listingSource: optionalTextField("Listing source", 120),
    dealStatus: z.nativeEnum(DealStatus),
    ownerDependenceRating: optionalNumberField({
      label: "Owner dependence rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    recurringRevenueRating: optionalNumberField({
      label: "Recurring revenue rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    transferabilityRating: optionalNumberField({
      label: "Transferability rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    scheduleControlFitRating: optionalNumberField({
      label: "Schedule-control fit rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    brotherOperatorFitRating: optionalNumberField({
      label: "Brother-operator fit rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    aiResistanceScore: optionalNumberField({
      label: "AI resistance score",
      integer: true,
      min: 1,
      max: 5,
    }),
    keepDayJobFit: optionalNumberField({
      label: "Keep-day-job fit",
      integer: true,
      min: 1,
      max: 5,
    }),
    quitDayJobFit: optionalNumberField({
      label: "Quit-day-job fit",
      integer: true,
      min: 1,
      max: 5,
    }),
    primaryUseCase: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (!value) {
          return;
        }

        if (!primaryUseCaseValues.includes(value as (typeof primaryUseCaseValues)[number])) {
          ctx.addIssue({
            code: "custom",
            message: "Choose a valid primary use case.",
          });
        }
      })
      .transform((value) =>
        value === ""
          ? undefined
          : (value as (typeof primaryUseCaseValues)[number]),
      ),
    beatsCurrentBenchmark: optionalBooleanField("Beats current benchmark"),
    benchmarkNotes: optionalTextField("Benchmark notes", 2000),
    financeabilityRating: optionalNumberField({
      label: "Financeability rating",
      integer: true,
      min: 1,
      max: 5,
    }),
    sellerFinancingAvailable: optionalBooleanField(
      "Seller financing available",
    ),
    sellerFinancingNotes: optionalTextField("Seller financing notes", 2000),
    operatorSkillDependency: optionalNumberField({
      label: "Operator skill dependency",
      integer: true,
      min: 1,
      max: 5,
    }),
    licenseDependency: optionalNumberField({
      label: "License dependency",
      integer: true,
      min: 1,
      max: 5,
    }),
    afterHoursBurden: optionalNumberField({
      label: "After-hours burden",
      integer: true,
      min: 1,
      max: 5,
    }),
    capexRisk: optionalNumberField({
      label: "Capex risk",
      integer: true,
      min: 1,
      max: 5,
    }),
    regretIfWrongScore: optionalNumberField({
      label: "Regret-if-wrong score",
      integer: true,
      min: 1,
      max: 5,
    }),
    dataConfidenceScore: optionalNumberField({
      label: "Data confidence score",
      integer: true,
      min: 1,
      max: 5,
    }),
    staleListingRisk: optionalNumberField({
      label: "Stale listing risk",
      integer: true,
      min: 1,
      max: 5,
    }),
    keyPersonRisk: optionalNumberField({
      label: "Key-person risk",
      integer: true,
      min: 1,
      max: 5,
    }),
    homeBasedFlag: optionalBooleanField("Home-based flag"),
    recurringRevenuePercent: optionalNumberField({
      label: "Recurring revenue percent",
      min: 0,
      max: 100,
    }),
    ownerHoursClaimed: optionalNumberField({
      label: "Owner hours claimed",
      integer: true,
      min: 0,
      max: 168,
    }),
    opsManagerExists: optionalBooleanField("Ops manager exists"),
    freshnessVerifiedAt: optionalDateTimeField("Freshness verified at"),
    cashToCloseNotes: optionalTextField("Cash-to-close notes", 2000),
    overallScore: optionalNumberField({
      label: "Overall score",
      integer: true,
      min: 0,
      max: 100,
    }),
    notes: optionalTextField("Notes", 4000),
    tags: z.string().transform((value) => splitTags(value)),
  })
  .transform((value) => {
    const explicitScore = value.overallScore;

    if (explicitScore !== undefined) {
      return value;
    }

    const ratings = [
      value.ownerDependenceRating,
      value.recurringRevenueRating,
      value.transferabilityRating,
      value.scheduleControlFitRating,
      value.brotherOperatorFitRating,
    ].filter((rating): rating is number => rating !== undefined);

    if (ratings.length < 3) {
      return value;
    }

    const overallScore = deriveOverallScoreFromRatings({
      ownerDependenceRating: value.ownerDependenceRating,
      recurringRevenueRating: value.recurringRevenueRating,
      transferabilityRating: value.transferabilityRating,
      scheduleControlFitRating: value.scheduleControlFitRating,
      brotherOperatorFitRating: value.brotherOperatorFitRating,
    });

    return {
      ...value,
      overallScore,
    };
  });

const presetFormSchema = z.object({
  name: requiredTextField("Preset name", 2, 60),
  query: z.string().trim().min(2, "Current filter query is missing."),
});

const noteFormSchema = z.object({
  body: requiredTextField("Note", 3, 2000),
});

const statusFormSchema = z.object({
  dealStatus: z.nativeEnum(DealStatus),
});

export type BusinessFormInput = z.infer<typeof businessFormSchema>;
export type NoteFormInput = z.infer<typeof noteFormSchema>;
export type StatusFormInput = z.infer<typeof statusFormSchema>;

export function createValidationErrorState(
  error: z.ZodError,
  message = "Please fix the highlighted fields and try again.",
): ActionState {
  return {
    status: "error",
    message,
    fieldErrors: error.flatten().fieldErrors,
  };
}

export function parseBusinessForm(formData: FormData) {
  return businessFormSchema.safeParse(
    getFormValues(formData, businessFieldNames),
  );
}

export function parseNoteForm(formData: FormData) {
  return noteFormSchema.safeParse(getFormValues(formData, noteFieldNames));
}

export function parseStatusForm(formData: FormData) {
  return statusFormSchema.safeParse(getFormValues(formData, statusFieldNames));
}

export function parsePresetForm(formData: FormData) {
  const raw = getFormValues(formData, presetFieldNames);
  const parsed = presetFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false as const,
      state: createValidationErrorState(parsed.error),
    };
  }

  try {
    const query = JSON.parse(parsed.data.query) as Record<
      string,
      string | string[] | undefined
    >;

    return {
      success: true as const,
      data: {
        name: parsed.data.name,
        query: serializeBusinessFilters(parseBusinessFilters(query)),
      },
    };
  } catch {
    return {
      success: false as const,
      state: {
        status: "error" as const,
        message: "Could not understand the current filters.",
      },
    };
  }
}
