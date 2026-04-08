import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const BACKFILL_DATE = "2026-04-07";
export const BACKFILL_NOTE_HEADING = `Backfill analysis (${BACKFILL_DATE})`;
export const VERIFIED_AT = new Date("2026-04-07T12:00:00-04:00");
export const CLEANUP_STATUS_DESCRIPTION =
  "Moved out of active pipeline during thesis cleanup: low-fit / trade-heavy / owner-dependent.";

export const ARCHIVE_BUSINESS_NAMES = [
  "Exceptional Termite Control Company Tremendous Growth Potential",
  "Profitable Home-Based Service Business | Proven Demand & Ready to Grow",
  "Garage Door Installation & Repair",
  "Highly Profitable Chimney Repair and Duct Cleaning Business",
  "Chimney Cleaning and Repair Service - by Doug Jackson",
  "Garage Door Installation and Service, Commercial and Residential",
  "Highly Reputable Plumbing and HVAC Installation and Service Business",
] as const;

export type LegacyRatings = {
  ownerDependenceRating: number;
  recurringRevenueRating: number;
  transferabilityRating: number;
  scheduleControlFitRating: number;
  brotherOperatorFitRating: number;
};

export type BackfillManualFields = {
  aiResistanceScore: number;
  financeabilityRating: number;
  sellerFinancingAvailable: boolean | null;
  sellerFinancingNotes: string | null;
  operatorSkillDependency: number;
  licenseDependency: number;
  afterHoursBurden: number;
  capexRisk: number;
  regretIfWrongScore: number;
  dataConfidenceScore: number;
  keepDayJobFit: number;
  quitDayJobFit: number;
  primaryUseCase: PrimaryUseCaseValue;
  beatsCurrentBenchmark: boolean;
  benchmarkNotes: string;
  freshnessVerifiedAt: Date | null;
  staleListingRisk: number;
  homeBasedFlag: boolean | null;
  recurringRevenuePercent: number | null;
  ownerHoursClaimed: number | null;
  opsManagerExists: boolean | null;
  keyPersonRisk: number;
  cashToCloseNotes: string;
};

export type AnalysisBlock = {
  thesisFit: string;
  mainReasons: string;
  failureModes: string;
  keepDayJobView: string;
  quitDayJobView: string;
  benchmarkComparison: string;
  confidence: string;
};

export type BackfillSpec = {
  manual: BackfillManualFields;
  analysis: AnalysisBlock;
};

type NewListingSeedInput = {
  businessName: string;
  sourceUrl: string;
  category: string;
  subcategory: string;
  location: string;
  stateCode: string;
  askingPrice: number | null;
  revenue: number | null;
  sde: number | null;
  ebitda: number | null;
  employees: number | null;
  summary: string;
  whyItMayFit: string;
  risks: string;
  brokerName: string | null;
  brokerFirm: string | null;
  listingSource: string;
  notes: string;
  tags: string[];
  legacyRatings: LegacyRatings;
  spec: BackfillSpec;
};

function buildAnalysisBlock(analysis: AnalysisBlock) {
  return [
    BACKFILL_NOTE_HEADING,
    `- Thesis fit: ${analysis.thesisFit}`,
    `- Main reasons it may work: ${analysis.mainReasons}`,
    `- Main failure modes: ${analysis.failureModes}`,
    `- Keep-day-job view: ${analysis.keepDayJobView}`,
    `- Quit-day-job view: ${analysis.quitDayJobView}`,
    `- Benchmark comparison: ${analysis.benchmarkComparison}`,
    `- Confidence / missing diligence: ${analysis.confidence}`,
  ].join("\\n");
}

function buildCreateData(seed: NewListingSeedInput) {
  const overallScore = deriveOverallScoreFromRatings(seed.legacyRatings) ?? null;
  const notes = `${seed.notes}\\n\\n${buildAnalysisBlock(seed.spec.analysis)}`;

  return {
    businessName: seed.businessName,
    sourceUrl: seed.sourceUrl,
    category: seed.category,
    subcategory: seed.subcategory,
    location: seed.location,
    stateCode: seed.stateCode,
    askingPrice: seed.askingPrice,
    revenue: seed.revenue,
    sde: seed.sde,
    ebitda: seed.ebitda,
    employees: seed.employees,
    summary: seed.summary,
    whyItMayFit: seed.whyItMayFit,
    risks: seed.risks,
    brokerName: seed.brokerName,
    brokerFirm: seed.brokerFirm,
    listingSource: seed.listingSource,
    dealStatus: DealStatus.NEW,
    ownerDependenceRating: seed.legacyRatings.ownerDependenceRating,
    recurringRevenueRating: seed.legacyRatings.recurringRevenueRating,
    transferabilityRating: seed.legacyRatings.transferabilityRating,
    scheduleControlFitRating: seed.legacyRatings.scheduleControlFitRating,
    brotherOperatorFitRating: seed.legacyRatings.brotherOperatorFitRating,
    aiResistanceScore: seed.spec.manual.aiResistanceScore,
    financeabilityRating: seed.spec.manual.financeabilityRating,
    sellerFinancingAvailable: seed.spec.manual.sellerFinancingAvailable,
    sellerFinancingNotes: seed.spec.manual.sellerFinancingNotes,
    operatorSkillDependency: seed.spec.manual.operatorSkillDependency,
    licenseDependency: seed.spec.manual.licenseDependency,
    afterHoursBurden: seed.spec.manual.afterHoursBurden,
    capexRisk: seed.spec.manual.capexRisk,
    regretIfWrongScore: seed.spec.manual.regretIfWrongScore,
    dataConfidenceScore: seed.spec.manual.dataConfidenceScore,
    keepDayJobFit: seed.spec.manual.keepDayJobFit,
    quitDayJobFit: seed.spec.manual.quitDayJobFit,
    primaryUseCase: seed.spec.manual.primaryUseCase,
    beatsCurrentBenchmark: seed.spec.manual.beatsCurrentBenchmark,
    benchmarkNotes: seed.spec.manual.benchmarkNotes,
    freshnessVerifiedAt: seed.spec.manual.freshnessVerifiedAt,
    staleListingRisk: seed.spec.manual.staleListingRisk,
    homeBasedFlag: seed.spec.manual.homeBasedFlag,
    recurringRevenuePercent: seed.spec.manual.recurringRevenuePercent,
    ownerHoursClaimed: seed.spec.manual.ownerHoursClaimed,
    opsManagerExists: seed.spec.manual.opsManagerExists,
    keyPersonRisk: seed.spec.manual.keyPersonRisk,
    cashToCloseNotes: seed.spec.manual.cashToCloseNotes,
    overallScore,
    notes,
    tags: seed.tags,
    historyEvents: {
      create: {
        eventType: "CREATED" as const,
        description: "Added from the public listing thesis backfill set.",
        metadata: {
          backfillDate: BACKFILL_DATE,
          sourceUrl: seed.sourceUrl,
        },
      },
    },
  } satisfies Prisma.BusinessCreateInput;
}

export const existingBackfills: Record<string, BackfillSpec> = {
  "Anchor Point Bookkeeping Co.": {
    manual: {
      aiResistanceScore: 1,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 1,
      capexRisk: 1,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County as the current bridge benchmark. The recurring model is attractive, but AI exposure and weaker family-operator fit keep it behind the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Simple services math likely understates the real risk here because most value sits in client retention and staff continuity rather than hard assets.",
    },
    analysis: {
      thesisFit: "Strong cash quality, but weaker alignment with the physical-world thesis.",
      mainReasons:
        "Monthly retainers, low capex, and a manageable team create a workable delegated-owner model.",
      failureModes:
        "AI pressure, referral concentration, and soft switching costs could compress value faster than the historical numbers suggest.",
      keepDayJobView:
        "Plausible if a reliable client-success lead is in place, but the owner can still get pulled into escalations.",
      quitDayJobView:
        "Could replace a paycheck if retention holds, though the thesis is less compelling than the service-route alternatives.",
      benchmarkComparison:
        "Does not beat the Fairfax HVAC benchmark because the benchmark is more AI-resilient and better aligned with the brother-run operating model.",
      confidence:
        "Confidence is decent because this is a curated internal record, but the AI-risk judgment is an inference rather than a broker-stated fact.",
    },
  },
  "Blue Ridge HVAC Services": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This is harder operationally but clearly stronger for the quit-day-job lane because the earnings base and team depth are materially larger.",
      freshnessVerifiedAt: null,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Truck refresh, seasonality, and any real working-capital need could push actual close cash above the simple 14% to 20% range.",
    },
    analysis: {
      thesisFit: "Best viewed as a full-time replacement candidate, not a clean keep-the-job bridge.",
      mainReasons:
        "The business has real scale, recurring maintenance, and enough field bench to support a serious operating company.",
      failureModes:
        "Lead-tech concentration, quote review dependence, and after-hours routing can drag the owner back into the business quickly.",
      keepDayJobView:
        "Possible only if the bench is real and the brother can absorb dispatch and field issues without constant owner intervention.",
      quitDayJobView:
        "Strong if the service agreement base is real and transferable because the earnings base is large enough to matter.",
      benchmarkComparison:
        "This beats the Fairfax HVAC benchmark for the quit-day-job lane on scale and cash generation, though it carries more technical and capex risk.",
      confidence:
        "Confidence is solid because the internal record is specific, but the exact management-layer depth still needs diligence.",
    },
  },
  "Commercial Cleaning Business with Recurring Revenue!": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The scale is larger, but the labor complexity, demolition mix, and sale-pending status keep it from clearly beating the benchmark for this thesis.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The default close-cash range may be light if payroll float, demolition receivables, or working-capital true-ups are meaningful.",
    },
    analysis: {
      thesisFit: "Serious operating company shape, but only for the full-time lane.",
      mainReasons:
        "Meaningful scale and disclosed recurring janitorial work make this more durable than the small technician-led deals.",
      failureModes:
        "Demolition adds messier execution risk, labor supervision is heavy, and sale-pending status raises freshness questions.",
      keepDayJobView:
        "Only middling because a large labor-heavy janitorial-destruction platform can still generate constant staffing noise.",
      quitDayJobView:
        "Strong if the org chart is real because the earnings base is large enough to justify direct ownership.",
      benchmarkComparison:
        "It does not clearly beat the current benchmark because it trades simplicity for scale and adds more labor-management burden.",
      confidence:
        "Confidence is moderate because the listing gives enough direction but still hides exact headcount detail and service-line margin mix.",
    },
  },
  "Commercial Landscaping Company- $1M+ Revenue and Strong Cash Flow": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This looks crew-manageable, but fleet intensity and seasonal exposure make it less clean than the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Truck and equipment replacement risk can make the modeled close-cash range too optimistic if the fleet is older than it sounds.",
    },
    analysis: {
      thesisFit: "Good brother-operator shape, though capex matters.",
      mainReasons:
        "Commercial repeat work and an experienced crew point toward a real operating business instead of a solo trade job.",
      failureModes:
        "Seasonality, equipment wear, and customer concentration can erode the clean story quickly.",
      keepDayJobView:
        "Reasonable because a brother-led field model is believable if there are crew leads and repeat clients.",
      quitDayJobView:
        "Also plausible because the earnings are enough to matter if the customer base holds.",
      benchmarkComparison:
        "It stays behind the Fairfax HVAC benchmark because the benchmark needs less fleet capital and has cleaner geography for the current thesis.",
      confidence:
        "Confidence is decent, but missing headcount and contract detail keep this from a top-tier conviction rating.",
    },
  },
  "Commercial Services Business Serving Professional Facilities": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 2,
      dataConfidenceScore: 2,
      keepDayJobFit: 2,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Missing cash flow and staffing detail leave this well behind the current benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 4,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Without real cash flow disclosure, the modeled cash-to-close range is not the limiting question; the underwriting story itself is still thin.",
    },
    analysis: {
      thesisFit: "Potentially okay business model, but not strong enough on disclosed facts.",
      mainReasons:
        "The signed-contract angle is directionally attractive and the category is thesis-friendly.",
      failureModes:
        "No SDE, no employee count, and thin operating detail make it too easy to overread broker language.",
      keepDayJobView:
        "Too uncertain to rate as a real bridge candidate until staffing and economics are verified.",
      quitDayJobView:
        "Also too uncertain because the real cash generation is still unknown.",
      benchmarkComparison:
        "It does not approach the current benchmark because the benchmark at least discloses usable economics and operating facts.",
      confidence:
        "Confidence is low because the listing is promotional and under-disclosed.",
    },
  },
  "Commercial power washing with reoccurring revenue!": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 2,
      regretIfWrongScore: 4,
      dataConfidenceScore: 3,
      keepDayJobFit: 4,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.bridge_while_employed,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The price-to-cash-flow is attractive, but the marketing-heavy presentation and missing staffing detail keep it behind the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Close cash looks manageable on paper, but seasonal working capital and equipment upkeep could make the low end optimistic.",
    },
    analysis: {
      thesisFit: "Useful bridge candidate if the systems story is real.",
      mainReasons:
        "Cheap entry, strong stated SDE, and recurring maintenance programs fit the keep-the-job lane.",
      failureModes:
        "The call-center and systems claims may be more marketing than reality, and missing headcount is a problem.",
      keepDayJobView:
        "Good enough to stay in the bridge lane if the current setup can run without daily owner dispatch.",
      quitDayJobView:
        "Less compelling because the business may still be too small and too dependent on operational consistency.",
      benchmarkComparison:
        "It stays below the benchmark because confidence is lower and the local-operating-story is less proven.",
      confidence:
        "Confidence is moderate at best because the listing reads promotional and omits staffing depth.",
    },
  },
  "Established Cleaning Business - Multi-State Commercial Clients": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This has cleaner recurring-contract language, but the multi-state sprawl adds more moving parts than the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Payroll float, insurance, and multi-jurisdiction operations could pull required close cash toward the high end.",
    },
    analysis: {
      thesisFit: "One of the better cleaning-platform candidates, though still labor-heavy.",
      mainReasons:
        "Recurring contracts and team support are structurally better than most small technician-led home-service deals.",
      failureModes:
        "Multi-state sprawl, short transition support, and unknown staffing depth can still create chaos quickly.",
      keepDayJobView:
        "Reasonable if there is already a real lead layer beneath the owner.",
      quitDayJobView:
        "Also plausible because the scale is enough to matter if margins hold.",
      benchmarkComparison:
        "It does not clearly beat the current benchmark because the benchmark is simpler and more locally concentrated.",
      confidence:
        "Confidence is decent, but not high enough to clear the benchmark without better employee and contract detail.",
    },
  },
  "Established Dryer Vent Cleaning Franchise Resale – Washington, DC": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.bridge_while_employed,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Money Saving Service Business - Dryer Vent Cleaning - Fairfax as the lower-capital bridge benchmark. This has more team depth, but the higher price and franchise drag keep it from clearly winning.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 2,
      cashToCloseNotes:
        "Franchise transfer costs and van refresh could make the simple close-cash range a little light.",
    },
    analysis: {
      thesisFit: "Solid bridge-lane candidate, but not a big enough full-time replacement story.",
      mainReasons:
        "Simple service, some staff depth, and franchisor support lower first-deal friction.",
      failureModes:
        "Franchise fees and limited upside can leave the owner with a decent job rather than a true platform.",
      keepDayJobView:
        "Good because the service is procedural and the staff model is more than one technician.",
      quitDayJobView:
        "Weak because post-brother cash is unlikely to justify leaving the day job on this size alone.",
      benchmarkComparison:
        "It stays behind the Fairfax dryer-vent benchmark on entry cost and simplicity, even though it has better staff depth.",
      confidence:
        "Confidence is fairly good because the listing discloses staffing and repeat-customer signals, but franchise economics still need work.",
    },
  },
  "Established Secure Document & Specialty Disposal Business – South FL": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Flowers Bread Route, Fairfax County, Virginia as the current route benchmark. This is more capital-intensive, but the recurring agreements, route density, and more manager-like operating shape make it the better route-style thesis fit.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Vehicles, shredding-disposal equipment, and route working capital can make the high end of the close-cash range more realistic.",
    },
    analysis: {
      thesisFit: "One of the cleanest thesis fits in the dataset.",
      mainReasons:
        "Route density, recurring agreements, and only three full-time employees make this easier to picture under delegated ownership.",
      failureModes:
        "A very small team still creates key-person exposure, and Florida route economics need to be real.",
      keepDayJobView:
        "Good because the operation is procedural and less tied to one technical craft skill.",
      quitDayJobView:
        "Very good if the recurring agreement base is real because the economics are large enough to matter.",
      benchmarkComparison:
        "It beats the current route benchmark because it looks more like an actual route platform and less like an owner-driver job.",
      confidence:
        "Confidence is fairly strong, though customer concentration and route density still need diligence.",
    },
  },
  "Established wildlife control business": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: true,
      sellerFinancingNotes: "Listing explicitly says seller financing is available.",
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This is cheaper and financeable, but it is more license- and operator-dependent than the current benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Vehicle costs, permit continuity, and messy field execution risk can make the modeled cash range look cleaner than reality.",
    },
    analysis: {
      thesisFit: "Interesting niche, but it misses both core lanes cleanly.",
      mainReasons:
        "Seller financing and four employees make it more substantial than a solo wildlife operator.",
      failureModes:
        "Wildlife work is still specialized, messy, and likely to create after-hours interruptions and seller-skill dependence.",
      keepDayJobView:
        "Weak because the owner is still likely to get dragged into field or customer issues.",
      quitDayJobView:
        "Only middling because the niche is narrow and key-person transfer risk is real.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is cleaner to transfer and easier to supervise without technical wildlife knowledge.",
      confidence:
        "Confidence is decent on the disclosed facts, but the transferability judgment is still an inference.",
    },
  },
  "Northshore Commercial Cleaning": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The contract base and team depth make this a stronger delegated-ownership platform if labor quality is real, so it currently beats the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Payroll float and contract working capital could push actual close cash above the midpoint even if the SBA debt story works.",
    },
    analysis: {
      thesisFit: "Very strong thesis fit if the contract and labor bench really hold.",
      mainReasons:
        "Multiyear agreements and a 28-person team create the shape of a real delegated operating company.",
      failureModes:
        "Labor churn and owner-covered escalations can still hide fragile economics.",
      keepDayJobView:
        "Good because the service is procedural and the staffing base is already sizable.",
      quitDayJobView:
        "Very good because the earnings base can justify direct ownership if the margins are durable.",
      benchmarkComparison:
        "It beats the benchmark because the recurring contract depth and team scale look more like a scalable operating platform than a small local service shop.",
      confidence:
        "Confidence is high enough to elevate it, though margin durability under wage pressure still needs diligence.",
    },
  },
  "Pest Control Management Business": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 2,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The apparent economics are better on paper, but the unusually low ask and licensing questions keep it from beating the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 4,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The SBA math looks easy, but the real issue is whether the very low ask is hiding working-capital, licensing, or quality-of-earnings problems.",
    },
    analysis: {
      thesisFit: "Potentially great small platform, but the numbers are suspicious enough to cap conviction.",
      mainReasons:
        "Low price, recurring pest routes, and six employees make it structurally interesting.",
      failureModes:
        "The price is almost too cheap, which raises obvious diligence questions around data quality and transferability.",
      keepDayJobView:
        "Possible, but only if the route base and licensing setup are genuinely stable.",
      quitDayJobView:
        "Good on paper because the earnings are strong relative to price, if those earnings survive diligence.",
      benchmarkComparison:
        "It does not beat the benchmark because confidence is lower and the downside of being wrong looks worse than the headline multiple suggests.",
      confidence:
        "Confidence is intentionally low because the listing shape invites skepticism.",
    },
  },
  "Philadelphia Repair Company: Parking Lot Maintenance": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: false,
      sellerFinancingNotes:
        "Listing mentions third-party financing availability, not seller carry.",
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 2,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The multiple is appealing, but the emergency-work language and weather exposure make it a worse fit than the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Equipment wear, weather swings, and emergency-work staffing can make the modeled close-cash range too clean.",
    },
    analysis: {
      thesisFit: "Economically interesting, but the operating rhythm is rougher than it first looks.",
      mainReasons:
        "Multiple commercial service lines and a five-person team give it more structure than a one-truck trade shop.",
      failureModes:
        "24-7 emergency language and seasonality work directly against the lifestyle-control thesis.",
      keepDayJobView:
        "Weak because after-hours work and dispatch issues can pull the owner in fast.",
      quitDayJobView:
        "Only moderate because the cash flow is good but the operating rhythm is still messy.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark offers a simpler, more stable operating cadence.",
      confidence:
        "Confidence is medium because the listing offers useful facts, but not enough to neutralize the schedule risk.",
    },
  },
  "Prairie Fire Equipment Rental": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 5,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The scale is attractive, but capex intensity and asset-cycle risk keep it from displacing the benchmark in the current thesis.",
      freshnessVerifiedAt: null,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Close cash could land materially above the default range once fleet and replacement capex are reflected honestly.",
    },
    analysis: {
      thesisFit: "Interesting full-time platform, but the downside is harsher than the service businesses.",
      mainReasons:
        "The business has measurable utilization and enough scale to matter if the fleet is healthy.",
      failureModes:
        "Capex timing, handshake customer relationships, and asset obsolescence can wreck a seemingly cheap deal.",
      keepDayJobView:
        "Only middling because asset-heavy rental fleets still create maintenance and uptime issues.",
      quitDayJobView:
        "Strong if the fleet is healthy because the earnings base is meaningful.",
      benchmarkComparison:
        "It does not beat the benchmark because the capital burden and downside severity are both meaningfully worse.",
      confidence:
        "Confidence is decent on the broad shape, but asset diligence is still the whole ballgame here.",
    },
  },
  "Profitable Pest Control Business: Turnkey & Recession Proof": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: true,
      sellerFinancingNotes: "Listing explicitly says seller financing is available.",
      operatorSkillDependency: 3,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Seller financing helps, but the price is rich for a two-employee bench, so it stays behind the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: 20,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The modeled equity check ignores how fragile the labor bench is; a thin team can turn a financeable deal into a bad one quickly.",
    },
    analysis: {
      thesisFit: "Understandable model, but too thin and too expensive for the thesis.",
      mainReasons:
        "Recurring pest work, seller financing, and stated 20-hour owner weeks are directionally good signals.",
      failureModes:
        "Two employees is not enough depth for this price, and licensing plus route continuity still matter.",
      keepDayJobView:
        "Weak because a two-person bench can pull the owner into day-to-day issues immediately.",
      quitDayJobView:
        "Only middling because the size is not large enough to justify the risk cleanly.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark offers better staffing depth and a cleaner cost-to-risk tradeoff.",
      confidence:
        "Confidence is decent on the facts, but the thesis conclusion is negative because the bench depth is too thin.",
    },
  },
  "Profitable Residential Pest Control Company": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The recurring mix is good, but missing SDE and transfer detail keep it from beating the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: 70,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Modeled close cash is not the core issue here; the real underwriting question is what normalized owner cash actually is after replacing the owner.",
    },
    analysis: {
      thesisFit: "Good route-service shape, but the missing SDE prevents a stronger conviction.",
      mainReasons:
        "Seventy percent recurring revenue and a seven-person team are strong structural signals.",
      failureModes:
        "If the undisclosed owner cash is weaker than it looks, the nice recurring story loses a lot of value quickly.",
      keepDayJobView:
        "Decent because the route base and team size are better than many small pest listings.",
      quitDayJobView:
        "Potentially strong if the real owner cash is there and licenses transfer cleanly.",
      benchmarkComparison:
        "It does not beat the benchmark because the headline looks good but the real economics are still partially hidden.",
      confidence:
        "Confidence is moderate because recurring percentage and team size are disclosed, but SDE opacity is too important to ignore.",
    },
  },
  "Profitable Semi-Absentee Air Duct & HVAC Cleaning Biz 30+ Years": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: true,
      sellerFinancingNotes: "Listing explicitly says seller financing is available.",
      operatorSkillDependency: 3,
      licenseDependency: 2,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This is bigger and more transferable, but it requires so much more capital that it changes the thesis instead of clearly beating the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: 15,
      opsManagerExists: null,
      keyPersonRisk: 2,
      cashToCloseNotes:
        "At this price, real close cash is likely to land toward the high end once fleet, working capital, and lender reserves are included.",
    },
    analysis: {
      thesisFit: "Excellent business shape, but it stretches the smaller-capital lane materially.",
      mainReasons:
        "Large staff, low stated owner hours, and long history make this one of the most transferable businesses in the set.",
      failureModes:
        "If the semi-absentee claim is exaggerated or key managers leave, the value case changes quickly.",
      keepDayJobView:
        "Surprisingly good if the management layer is real because the owner claim is only fifteen hours per week.",
      quitDayJobView:
        "Very strong on raw economics if the reported structure is real.",
      benchmarkComparison:
        "It does not clearly replace the benchmark because the capital required is much larger and changes the practical buying lane.",
      confidence:
        "Confidence is fairly high on the broad shape, but the org-chart proof still matters a lot.",
    },
  },
  "Profitable Wildlife Removal, Pest Control and Restoration Service": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The named staff roles help, but the licensing and emergency-call burden make it a weaker thesis fit than the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Because SDE is undisclosed, the simple modeled close-cash range is less important than proving real post-close operator economics.",
    },
    analysis: {
      thesisFit: "Better than the weaker wildlife-trade deals, but still not top-tier.",
      mainReasons:
        "The listing at least names an operations manager and other staff roles, which makes transferability more believable.",
      failureModes:
        "Wildlife, restoration, and licensing still create messy downside and real after-hours exposure.",
      keepDayJobView:
        "Possible but not clean because emergency or technical issues can still drag the owner in.",
      quitDayJobView:
        "Moderate if the economics are real, but the model still carries more field chaos than the cleaner benchmarks.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is simpler and less dependent on niche technical and licensing continuity.",
      confidence:
        "Confidence is moderate because the listing at least gives role detail, but SDE opacity remains a big gap.",
    },
  },
  "Riverbend Property Inspection Group": {
    manual: {
      aiResistanceScore: 3,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 1,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This is lower capex, but inspector talent and referral-channel dependence make it a weaker benchmark challenger.",
      freshnessVerifiedAt: null,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Entry cash is manageable, but the real risk sits in agent referrals and licensed inspector retention rather than closing costs.",
    },
    analysis: {
      thesisFit: "Reasonable first-deal candidate, but not a thesis leader.",
      mainReasons:
        "Low capex and a clear dispatch-reporting model help, and the team is not tiny.",
      failureModes:
        "Agent concentration and inspector licensing can make the business feel more fragile than the simple model suggests.",
      keepDayJobView:
        "Only moderate because inspection quality issues and referral relationships can still pull the owner in.",
      quitDayJobView:
        "Good enough if the referral base is durable and lead inspectors stay.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is more AI-resilient and less tied to referral-channel softness.",
      confidence:
        "Confidence is decent because this is a curated internal record, though the referral and licensing risks are still inference-heavy.",
    },
  },
  "Stable Route-Based Business with Long-Term Clients": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 1,
      keepDayJobFit: 2,
      quitDayJobFit: 1,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. The location inconsistency alone keeps this from competing with the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 5,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Do not trust the modeled cash-to-close range until the actual market, route base, and financials are verified.",
    },
    analysis: {
      thesisFit: "Still active only as a question mark, not as a preferred deal.",
      mainReasons:
        "If the listing were coherent, a small recurring route business could fit the broader thesis.",
      failureModes:
        "The title-location conflict is severe enough that the listing might not describe the advertised business accurately at all.",
      keepDayJobView:
        "Weak because even the basic facts are too unstable to trust.",
      quitDayJobView:
        "Very weak because the disclosed SDE is thin and the listing quality is poor.",
      benchmarkComparison:
        "It does not come close to the route benchmark because the benchmark at least presents a coherent route story.",
      confidence:
        "Confidence is intentionally very low because the listing contains a major factual inconsistency.",
    },
  },
  "Thriving Multi-Service Cleaning Company with Tech-Driven Operations": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 2,
      afterHoursBurden: 4,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Stronger raw cash flow helps, but restoration complexity and the thin bench keep it behind the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The simple close-cash range may be optimistic if mitigation equipment, emergency jobs, or working-capital swings are material.",
    },
    analysis: {
      thesisFit: "Better for a direct-owner lane than a keep-the-job lane.",
      mainReasons:
        "Good apparent cash flow and systems language make it more appealing than a basic cleaning route.",
      failureModes:
        "Only three employees plus restoration work is thin and can create chaotic operating spikes.",
      keepDayJobView:
        "Weak because restoration-style work is exactly the kind of thing that can ruin schedule control.",
      quitDayJobView:
        "Reasonable if the systems are real and the emergency-work share is smaller than feared.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is operationally cleaner and easier to delegate.",
      confidence:
        "Confidence is medium because the financials are appealing but the actual service mix still needs proof.",
    },
  },
  "Window Cleaning Business with $115k income": {
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: false,
      sellerFinancingNotes:
        "Listing mentions SBA 10% down style financing support, not seller carry.",
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Money Saving Service Business - Dryer Vent Cleaning - Fairfax as the low-capital bridge benchmark. This has more team depth, but the earnings are too thin relative to price to beat the benchmark.",
      freshnessVerifiedAt: null,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Franchise drag, vehicle upkeep, and multi-service complexity can make the modeled close-cash range look better than the actual risk-adjusted deal.",
    },
    analysis: {
      thesisFit: "Some positives, but the economics are too thin for the current benchmark set.",
      mainReasons:
        "Seven employees and repeat business provide more depth than a solo exterior-cleaning business.",
      failureModes:
        "The price relative to SDE is poor, and the multi-service franchise model adds more moving parts than the headline suggests.",
      keepDayJobView:
        "Possible, but only if the crew structure is very stable because the post-brother cash is not exciting.",
      quitDayJobView:
        "Weak because the earnings base does not justify the risk cleanly.",
      benchmarkComparison:
        "It stays behind the low-capital dryer-vent benchmark because the benchmark is cheaper, simpler, and cleaner on downside.",
      confidence:
        "Confidence is okay on the disclosed facts, but the deal still does not clear the thesis bar.",
    },
  },
};

export const newListingSeeds = [
  {
    businessName: "Profitable HVAC Air Quality & Duct Cleaning Business Franchise",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/profitable-hvac-air-quality-and-duct-cleaning-business-franchise/2451676/",
    category: "home services",
    subcategory: "air quality and duct cleaning franchise",
    location: "Fairfax County, VA",
    stateCode: "VA",
    askingPrice: 365000,
    revenue: 770000,
    sde: 165000,
    ebitda: null,
    employees: 4,
    summary:
      "Fairfax County air quality and duct cleaning franchise with four employees, three service vehicles, and home-based operations in the Washington metro market.",
    whyItMayFit:
      "Local geography, a modest capital requirement, and a service model that can support a brother-led operating role make this a strong bridge candidate.",
    risks:
      "The listing language is promotional, franchise economics matter, and vehicle or lease needs could make the simple model look cleaner than reality.",
    brokerName: "Leo Tudela",
    brokerFirm: "Sunbelt of Northern Virginia",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 365000, revenue 770000, SDE 165000, 4 employees, 3 service vehicles, home-based, established franchise, SBA financing available. Inference: this is a practical local benchmark because it is big enough to matter without jumping into a massive capital requirement. Missing: real franchise fee burden, true commercial-contract mix, and how much owner selling still drives results.",
    tags: [
      "duct-cleaning",
      "franchise",
      "fairfax",
      "local-benchmark",
      "home-based",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 3,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 4,
        sellerFinancingAvailable: false,
        sellerFinancingNotes:
          "Listing mentions SBA financing availability only; no seller carry is stated.",
        operatorSkillDependency: 3,
        licenseDependency: 2,
        afterHoursBurden: 2,
        capexRisk: 2,
        regretIfWrongScore: 4,
        dataConfidenceScore: 3,
        keepDayJobFit: 4,
        quitDayJobFit: 3,
        primaryUseCase: PrimaryUseCase.bridge_while_employed,
        beatsCurrentBenchmark: true,
        benchmarkNotes:
          "This is the current bridge-while-employed benchmark for local service deals: local market, moderate capital, real team depth, and no giant jump in complexity.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 2,
        cashToCloseNotes:
          "The default range may land light if franchise transfer costs, vehicle refresh, or lease commitments are larger than the listing suggests.",
      },
      analysis: {
        thesisFit: "Current bridge benchmark for the local service lane.",
        mainReasons:
          "Local geography, modest size, home-based operations, and enough staff depth make it easy to compare against new bridge candidates.",
        failureModes:
          "Franchise drag, promotional listing tone, and unclear commercial-contract depth still matter.",
        keepDayJobView:
          "Strong because it looks big enough to delegate without demanding immediate full-time owner immersion.",
        quitDayJobView:
          "Only moderate because the scale is real but not obviously large enough to justify leaving the day job quickly.",
        benchmarkComparison:
          "This is the current benchmark rather than a challenger.",
        confidence:
          "Confidence is moderate because the public listing gives useful specifics but still reads like broker marketing.",
      },
    },
  },
  {
    businessName: "Long-Established Commercial Cleaning & Contracting Company (37 Years)",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/long-established-commercial-cleaning-and-contracting-company-37-years/2448021/",
    category: "facility services",
    subcategory: "commercial cleaning and light contracting",
    location: "Annandale, VA",
    stateCode: "VA",
    askingPrice: 339000,
    revenue: 620000,
    sde: null,
    ebitda: null,
    employees: 14,
    summary:
      "Annandale commercial cleaning and light contracting company with 37 years of history, an office-only facility, and a 2 full-time plus 12 part-time staff structure.",
    whyItMayFit:
      "Local geography, long customer relationships, and a real staff base make it a practical local operating candidate if the economics are acceptable.",
    risks:
      "SDE is undisclosed and the contracting piece adds complexity and licensing questions that weaken the otherwise-clean cleaning story.",
    brokerName: "Dashka Altanbasan",
    brokerFirm: "Westgate Realty Group, Inc",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 339000, revenue 620000, no SDE disclosed, 2 full-time and 12 part-time employees, office-only facility, one month training. Inference: the local cleaning base is attractive, but the mixed contracting angle and missing owner cash keep this from being a clear benchmark challenger. Missing: normalized SDE, actual contracting mix, and what licenses or bids are tied to the seller.",
    tags: [
      "commercial-cleaning",
      "annandale",
      "local",
      "light-contracting",
      "under-disclosed",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 3,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 3,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 2,
        sellerFinancingAvailable: null,
        sellerFinancingNotes: null,
        operatorSkillDependency: 3,
        licenseDependency: 3,
        afterHoursBurden: 3,
        capexRisk: 1,
        regretIfWrongScore: 3,
        dataConfidenceScore: 3,
        keepDayJobFit: 3,
        quitDayJobFit: 3,
        primaryUseCase: PrimaryUseCase.bridge_while_employed,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The local location helps, but hidden cash flow and the contracting component keep it behind the benchmark.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: false,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 3,
        cashToCloseNotes:
          "Without disclosed SDE, lender and cash-to-close assumptions are less important than proving the actual owner cash and working-capital needs.",
      },
      analysis: {
        thesisFit: "Interesting local bridge candidate, but only with more financial clarity.",
        mainReasons:
          "Local geography, long history, and a meaningful staff base make it more relevant than many generic cleaning listings.",
        failureModes:
          "The general-contracting angle can quietly import licensing and project-management risk into an otherwise simple cleaning deal.",
        keepDayJobView:
          "Moderate because the staff base helps, but the mixed-services story could still drag the owner into estimates and supervision.",
        quitDayJobView:
          "Also moderate until normalized owner cash is proven.",
        benchmarkComparison:
          "It stays behind the benchmark because the benchmark has disclosed owner cash and a cleaner operating scope.",
        confidence:
          "Confidence is moderate because the listing is fresh and concrete on staffing, but still weak on economics.",
      },
    },
  },
  {
    businessName: "Most profitable business",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/most-profitable-business/2275885/",
    category: "route services",
    subcategory: "waste cooking oil collection",
    location: "Fairfax County, VA",
    stateCode: "VA",
    askingPrice: 300000,
    revenue: 700000,
    sde: 400000,
    ebitda: null,
    employees: 3,
    summary:
      "Fairfax County waste cooking oil collection and recycling business with more than 200 active accounts, three employees, seller financing, and home-based storage access.",
    whyItMayFit:
      "The recurring pickup model and apparently simple service rhythm make it an intriguing route-style business with meaningful headline cash flow.",
    risks:
      "The listing is highly promotional, the economics look unusually strong, and license or permit continuity could be a real hidden risk.",
    brokerName: null,
    brokerFirm: "Enviro waste, A Renewable solutions i",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 300000, revenue 700000, SDE 400000, 3 employees, 200+ active accounts, seller financing, home-based, permits and licenses included. Inference: the recurring pickup route sounds compelling, but this is the most promotional listing in the set and should be handled skeptically. Missing: clean financial support, exact permit-transfer mechanics, and proof that the owner really only oversees employees for a couple of hours per day.",
    tags: [
      "waste-oil",
      "route-business",
      "fairfax",
      "seller-financing",
      "promotional",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 5,
      transferabilityRating: 3,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 3,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 5,
        sellerFinancingAvailable: true,
        sellerFinancingNotes: "Listing explicitly says some owner financing is available.",
        operatorSkillDependency: 2,
        licenseDependency: 5,
        afterHoursBurden: 2,
        capexRisk: 4,
        regretIfWrongScore: 2,
        dataConfidenceScore: 1,
        keepDayJobFit: 3,
        quitDayJobFit: 4,
        primaryUseCase: PrimaryUseCase.full_time_replacement,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. The headline economics are stronger, but the promotional tone and license-transfer risk keep it from clearly beating the route benchmark.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 3,
        cashToCloseNotes:
          "The modeled close-cash range may be too optimistic if permit transfer, tank-equipment work, or route working capital are heavier than advertised.",
      },
      analysis: {
        thesisFit: "Interesting route story, but too promotional to trust at face value.",
        mainReasons:
          "If the numbers are real, the recurring pickup model and 200-plus accounts would be powerful.",
        failureModes:
          "This could be the kind of listing where the easy money is mostly broker copy and permit complexity is the real story.",
        keepDayJobView:
          "Only moderate because the owner role sounds light, but the listing is too promotional to trust blindly.",
        quitDayJobView:
          "Good on headline cash flow, assuming the economics survive diligence.",
        benchmarkComparison:
          "It does not beat the benchmark because confidence is much lower even though the headline numbers are better.",
        confidence:
          "Confidence is intentionally low because the listing reads like pure marketing copy with unusually strong economics.",
      },
    },
  },
  {
    businessName: "Flowers Bread Route, Fairfax County, Virginia",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/flowers-bread-route-fairfax-county-virginia/2461174/",
    category: "route services",
    subcategory: "bread route",
    location: "Fairfax, VA",
    stateCode: "VA",
    askingPrice: 215000,
    revenue: 729005,
    sde: 134052,
    ebitda: 134052,
    employees: null,
    summary:
      "Fairfax bread distributorship covering 17 accounts under a protected territory with company-related financing and route training support.",
    whyItMayFit:
      "This is a useful local route comparison because it is simple to understand, financeable, and already framed as a protected-territory route.",
    risks:
      "Bread routes are often owner-operator jobs with early-hour schedule burden, so the route benchmark is not the same thing as the best overall thesis fit.",
    brokerName: "Routes For Sale®",
    brokerFirm: "Routes For Sale",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 215000, revenue 729005, SDE and EBITDA 134052, 17 accounts, protected territory, company-related financing with 107000 down. Inference: this is a clean local route benchmark, but not an overall thesis winner because bread routes are often still owner-work jobs. Missing: exact labor setup, route-hour burden, and whether any helper labor is already embedded in the economics.",
    tags: [
      "bread-route",
      "fairfax",
      "route-benchmark",
      "protected-territory",
      "distribution",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 5,
      transferabilityRating: 3,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 1,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 3,
        sellerFinancingAvailable: false,
        sellerFinancingNotes:
          "Listing mentions company-related financing, not seller financing.",
        operatorSkillDependency: 1,
        licenseDependency: 1,
        afterHoursBurden: 4,
        capexRisk: 2,
        regretIfWrongScore: 4,
        dataConfidenceScore: 4,
        keepDayJobFit: 1,
        quitDayJobFit: 2,
        primaryUseCase: PrimaryUseCase.full_time_replacement,
        beatsCurrentBenchmark: true,
        benchmarkNotes:
          "This is the current route benchmark: understandable economics, protected-territory framing, and relatively modest entry capital, even though it is not the best overall thesis fit.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: null,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 4,
        cashToCloseNotes:
          "The route page itself requires reserve cash beyond the financed down payment, so actual close cash can land toward the high end even on a modest ask.",
      },
      analysis: {
        thesisFit: "Useful benchmark, but not an overall thesis winner.",
        mainReasons:
          "Protected-territory route economics and company financing make it a clean comparison point for route-style deals.",
        failureModes:
          "Bread routes often demand owner labor and early-hour schedule control that do not fit the keep-the-job lane.",
        keepDayJobView:
          "Poor because this likely behaves more like an owner-operated route than a delegated business.",
        quitDayJobView:
          "Only moderate because the route can generate cash but still may mostly buy the owner a job.",
        benchmarkComparison:
          "This is the route benchmark, but not the best overall benchmark for the acquisition thesis.",
        confidence:
          "Confidence is relatively good because the route listing is concrete and current.",
      },
    },
  },
  {
    businessName: "9 FedEx Ground Routes, Manassas VA",
    sourceUrl:
      "https://www.bizquest.com/business-for-sale/9-fedex-ground-routes-manassas-va/BW2453869/",
    category: "route services",
    subcategory: "fedex ground routes",
    location: "Manassas, VA",
    stateCode: "VA",
    askingPrice: 1154000,
    revenue: 1373000,
    sde: null,
    ebitda: null,
    employees: 10,
    summary:
      "Manassas FedEx ground route package with nine routes, ten full-time employees, eleven trucks, seller financing, and a full-time manager in place.",
    whyItMayFit:
      "The manager-in-place structure makes this one of the more believable route businesses for delegated ownership and eventual full-time replacement.",
    risks:
      "Cash flow is undisclosed, truck capex is real, and FedEx route businesses can still carry more personnel and contractor risk than the listing implies.",
    brokerName: "Allan Mendell",
    brokerFirm: "FXG Enterprises Inc",
    listingSource: "BizQuest",
    notes:
      "Observed: ask 1154000, revenue 1373000, 10 full-time employees, 11 trucks, home-based, full-time manager in place, seller may carry small financing. Inference: this is a serious delegated route business candidate, but the missing cash flow and truck base keep it from being a clean winner. Missing: normalized owner cash, exact driver economics, and current truck age-maintenance cycle.",
    tags: [
      "fedex",
      "ground-routes",
      "manassas",
      "manager-in-place",
      "seller-financing",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 3,
        sellerFinancingAvailable: true,
        sellerFinancingNotes:
          "Listing says the seller may carry small financing for a qualified buyer.",
        operatorSkillDependency: 2,
        licenseDependency: 2,
        afterHoursBurden: 3,
        capexRisk: 4,
        regretIfWrongScore: 3,
        dataConfidenceScore: 3,
        keepDayJobFit: 4,
        quitDayJobFit: 4,
        primaryUseCase: PrimaryUseCase.either,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. The manager and scale are appealing, but missing cash flow and truck exposure keep it from clearly beating the benchmark.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: true,
        keyPersonRisk: 2,
        cashToCloseNotes:
          "Truck reserve needs, driver retention risk, and route working capital could push actual close cash toward or above the top end of the simple range.",
      },
      analysis: {
        thesisFit: "Good delegated route candidate, though not a slam dunk.",
        mainReasons:
          "Manager in place, route density, and ten employees make it much more than an owner-driver route.",
        failureModes:
          "Undisclosed cash flow and truck replacement risk can ruin a route deal that looks fine on revenue alone.",
        keepDayJobView:
          "Good because the manager setup gives the owner a believable buffer from daily route execution.",
        quitDayJobView:
          "Also good if the real owner cash supports the larger capital ask.",
        benchmarkComparison:
          "It does not clearly beat the route benchmark because the missing cash flow creates too much uncertainty.",
        confidence:
          "Confidence is moderate because the route facts are concrete, but the hidden cash flow is a big gap.",
      },
    },
  },
  {
    businessName: "Money Saving Service Business - Dryer Vent Cleaning - Fairfax",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/money-saving-service-business-dryer-vent-cleaning-fairfax/2488480/",
    category: "home services",
    subcategory: "dryer vent cleaning",
    location: "Fairfax, VA",
    stateCode: "VA",
    askingPrice: 99980,
    revenue: 402300,
    sde: 88100,
    ebitda: null,
    employees: 2,
    summary:
      "Fairfax dryer vent cleaning business with two full-time employees, a van and equipment, a home-based structure, and third-party financing support.",
    whyItMayFit:
      "Very low entry cost and simple, practical service work make this a useful low-capital comparison point for the keep-the-job lane.",
    risks:
      "It is smaller, likely more marketing-sensitive, and may not produce enough post-brother cash to justify a full-time transition.",
    brokerName: "Gary Madison",
    brokerFirm: "Madison Market Group",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 99980, revenue 402300, SDE 88100, 2 full-time employees, van and equipment included, home-based, third-party financing only. Inference: this is the cleaner low-capital bridge benchmark, but the upside is narrower than the larger Fairfax HVAC benchmark. Missing: exact repeat-customer economics and whether customer acquisition is too broker-optimized.",
    tags: [
      "dryer-vent",
      "fairfax",
      "low-capital",
      "bridge-benchmark",
      "home-based",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 3,
      transferabilityRating: 4,
      scheduleControlFitRating: 5,
      brotherOperatorFitRating: 4,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 4,
        sellerFinancingAvailable: false,
        sellerFinancingNotes:
          "Listing explicitly says financing is third-party only, not seller financing.",
        operatorSkillDependency: 2,
        licenseDependency: 1,
        afterHoursBurden: 1,
        capexRisk: 1,
        regretIfWrongScore: 5,
        dataConfidenceScore: 3,
        keepDayJobFit: 5,
        quitDayJobFit: 2,
        primaryUseCase: PrimaryUseCase.bridge_while_employed,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "This is the current lower-capital secondary benchmark for the bridge lane. It wins on cheap entry and simple operations, but it does not replace the Fairfax HVAC benchmark on upside or team depth.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 3,
        cashToCloseNotes:
          "Even on a low-price deal, van replacement and customer-acquisition spend could make real close cash land above the bottom of the modeled range.",
      },
      analysis: {
        thesisFit: "Current low-capital bridge benchmark.",
        mainReasons:
          "Cheap entry and simple ops make it an important comparison point when a candidate claims to be a keep-the-job bridge.",
        failureModes:
          "Small scale means the owner can still end up buying a job if lead flow or technician stability weakens.",
        keepDayJobView:
          "Very good because the model is simple and the capital at risk is relatively low.",
        quitDayJobView:
          "Weak because the earnings are not large enough to make leaving the day job attractive on their own.",
        benchmarkComparison:
          "This is the low-capital benchmark, but not the overall best benchmark deal.",
        confidence:
          "Confidence is moderate because the public listing is detailed enough but still obviously promotional.",
      },
    },
  },
  {
    businessName: "Turnkey Appliance Repair Biz | Absentee Ownership Possible | SW VA",
    sourceUrl:
      "https://www.bizquest.com/business-for-sale/turnkey-appliance-repair-biz-absentee-ownership-possible-sw-va/BW2487506/",
    category: "home services",
    subcategory: "appliance repair",
    location: "Virginia",
    stateCode: "VA",
    askingPrice: 200000,
    revenue: 404801,
    sde: null,
    ebitda: null,
    employees: 6,
    summary:
      "Southwest Virginia residential appliance repair business with a trained team, home-based operations, and an absentee-ownership pitch.",
    whyItMayFit:
      "The trained-team story and low-overhead mobile model create a plausible keep-the-job candidate if the non-owner-dependent claim holds up.",
    risks:
      "Cash flow is undisclosed, technician skill still matters, and the absentee language is marketing until proven through the org chart.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizQuest",
    notes:
      "Observed: ask 200000, revenue 404801, 6 employees, home-based, trained team, absentee-ownership claim, no cash flow disclosed. Inference: the organizational shape is interesting, but this should be treated skeptically until the non-owner-dependent claim is documented. Missing: normalized SDE, actual technician bench depth, and evidence that the owner truly only handles oversight.",
    tags: [
      "appliance-repair",
      "virginia",
      "absentee-claim",
      "home-based",
      "needs-diligence",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 2,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 3,
        sellerFinancingAvailable: null,
        sellerFinancingNotes: null,
        operatorSkillDependency: 4,
        licenseDependency: 2,
        afterHoursBurden: 3,
        capexRisk: 2,
        regretIfWrongScore: 3,
        dataConfidenceScore: 3,
        keepDayJobFit: 4,
        quitDayJobFit: 2,
        primaryUseCase: PrimaryUseCase.bridge_while_employed,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The absentee angle is attractive, but undisclosed cash flow and technician dependence keep it behind the benchmark.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: null,
        keyPersonRisk: 2,
        cashToCloseNotes:
          "Modeled close cash is only part of the story here because the bigger issue is whether hidden technician or owner dependence makes the deal less transferable than advertised.",
      },
      analysis: {
        thesisFit: "Interesting bridge candidate, but only if the absentee claim is real.",
        mainReasons:
          "Low overhead and a trained team are exactly the signals that can make a keep-the-job lane work.",
        failureModes:
          "Cash flow is hidden and appliance repair still depends on technician skill that may not transfer cleanly.",
        keepDayJobView:
          "Good if there is truly a real team and no constant owner dispatch burden.",
        quitDayJobView:
          "Weak until normalized owner cash is disclosed.",
        benchmarkComparison:
          "It stays behind the current benchmark because the core economics are still partially hidden.",
        confidence:
          "Confidence is only moderate because the page is promising but under-disclosed on the most important number.",
      },
    },
  },
  {
    businessName: "3 FedEx Linehaul Routes - Stafford, VA - Highly Profitable",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/3-fedex-linehaul-routes-stafford-va-highly-profitable/2371208/",
    category: "route services",
    subcategory: "fedex linehaul routes",
    location: "Stafford, VA",
    stateCode: "VA",
    askingPrice: 625000,
    revenue: 811505,
    sde: 309669,
    ebitda: 309669,
    employees: 4,
    summary:
      "Stafford-based FedEx linehaul package with three contiguous routes, one driver per route, home-based operations, and a full-time manager in place.",
    whyItMayFit:
      "The manager-in-place setup creates a plausible delegated route business with better scale than an owner-driver route.",
    risks:
      "Linehaul still brings truck exposure and off-hours operating burden, so it is not a clean lifestyle fit even with the manager claim.",
    brokerName: "Alex Beringer",
    brokerFirm: "FXG Management",
    listingSource: "BizBuySell",
    notes:
      "Observed: ask 625000, revenue 811505, SDE and EBITDA 309669, home-based, one driver per route, full-time manager in place. Inference: this is a better route-style ownership model than a single-owner route, but truck capex and linehaul schedule burden still matter. Missing: exact manager economics, spare-truck condition, and how much overnight coverage the owner still handles.",
    tags: [
      "fedex",
      "linehaul",
      "stafford",
      "manager-in-place",
      "route-business",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    spec: {
      manual: {
        aiResistanceScore: 5,
        financeabilityRating: 4,
        sellerFinancingAvailable: null,
        sellerFinancingNotes: null,
        operatorSkillDependency: 2,
        licenseDependency: 2,
        afterHoursBurden: 4,
        capexRisk: 4,
        regretIfWrongScore: 3,
        dataConfidenceScore: 4,
        keepDayJobFit: 4,
        quitDayJobFit: 4,
        primaryUseCase: PrimaryUseCase.either,
        beatsCurrentBenchmark: false,
        benchmarkNotes:
          "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. This is more scalable and more manager-like, but overnight linehaul burden and truck risk keep it from clearly beating the benchmark.",
        freshnessVerifiedAt: VERIFIED_AT,
        staleListingRisk: 2,
        homeBasedFlag: true,
        recurringRevenuePercent: null,
        ownerHoursClaimed: null,
        opsManagerExists: true,
        keyPersonRisk: 2,
        cashToCloseNotes:
          "Truck condition, FedEx settlement timing, and reserve needs can make the high end of the default close-cash range the safer assumption.",
      },
      analysis: {
        thesisFit: "Promising route-style option, but not a slam dunk.",
        mainReasons:
          "Manager in place and contiguous routes are exactly the kinds of details that make route businesses more transferable.",
        failureModes:
          "Linehaul schedules and truck capex can turn a simple-looking route deal into a time sink.",
        keepDayJobView:
          "Reasonable because the manager claim gives the owner a real chance to stay out of daily route execution.",
        quitDayJobView:
          "Also reasonable because the cash flow is large enough to matter.",
        benchmarkComparison:
          "It is better than a pure owner-driver route, but not clearly better than the route benchmark once schedule burden is accounted for.",
        confidence:
          "Confidence is fairly good because the listing gives useful specifics, though linehaul details still need diligence.",
      },
    },
  },
].map((seed) => ({
  ...seed,
  createData: buildCreateData(seed),
})) satisfies Array<
  NewListingSeedInput & {
    createData: Prisma.BusinessCreateInput;
  }
>;
