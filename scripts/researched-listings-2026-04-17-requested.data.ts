import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const RESEARCHED_LISTING_BATCH_DATE = "2026-04-17";
export const RESEARCHED_LISTING_NOTE_HEADING = `Backfill analysis (${RESEARCHED_LISTING_BATCH_DATE})`;
export const RESEARCHED_LISTING_VERIFIED_AT = new Date(
  "2026-04-17T16:30:00-04:00",
);

type LegacyRatings = {
  ownerDependenceRating: number;
  recurringRevenueRating: number;
  transferabilityRating: number;
  scheduleControlFitRating: number;
  brotherOperatorFitRating: number;
};

type ManualFields = {
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

type AnalysisBlock = {
  thesisFit: string;
  mainReasons: string;
  failureModes: string;
  keepDayJobView: string;
  quitDayJobView: string;
  benchmarkComparison: string;
  confidence: string;
};

type ResearchedListingSeedInput = {
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
  dealStatus: DealStatus;
  notes: string;
  tags: string[];
  legacyRatings: LegacyRatings;
  manual: ManualFields;
  analysis: AnalysisBlock;
};

function buildAnalysisBlock(analysis: AnalysisBlock) {
  return [
    RESEARCHED_LISTING_NOTE_HEADING,
    `- Thesis fit: ${analysis.thesisFit}`,
    `- Main reasons it may work: ${analysis.mainReasons}`,
    `- Main failure modes: ${analysis.failureModes}`,
    `- Keep-day-job view: ${analysis.keepDayJobView}`,
    `- Quit-day-job view: ${analysis.quitDayJobView}`,
    `- Benchmark comparison: ${analysis.benchmarkComparison}`,
    `- Confidence / missing diligence: ${analysis.confidence}`,
  ].join("\n");
}

function buildManagedBusinessData(seed: ResearchedListingSeedInput) {
  const overallScore = deriveOverallScoreFromRatings(seed.legacyRatings) ?? null;

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
    dealStatus: seed.dealStatus,
    ownerDependenceRating: seed.legacyRatings.ownerDependenceRating,
    recurringRevenueRating: seed.legacyRatings.recurringRevenueRating,
    transferabilityRating: seed.legacyRatings.transferabilityRating,
    scheduleControlFitRating: seed.legacyRatings.scheduleControlFitRating,
    brotherOperatorFitRating: seed.legacyRatings.brotherOperatorFitRating,
    aiResistanceScore: seed.manual.aiResistanceScore,
    financeabilityRating: seed.manual.financeabilityRating,
    sellerFinancingAvailable: seed.manual.sellerFinancingAvailable,
    sellerFinancingNotes: seed.manual.sellerFinancingNotes,
    operatorSkillDependency: seed.manual.operatorSkillDependency,
    licenseDependency: seed.manual.licenseDependency,
    afterHoursBurden: seed.manual.afterHoursBurden,
    capexRisk: seed.manual.capexRisk,
    regretIfWrongScore: seed.manual.regretIfWrongScore,
    dataConfidenceScore: seed.manual.dataConfidenceScore,
    keepDayJobFit: seed.manual.keepDayJobFit,
    quitDayJobFit: seed.manual.quitDayJobFit,
    primaryUseCase: seed.manual.primaryUseCase,
    beatsCurrentBenchmark: seed.manual.beatsCurrentBenchmark,
    benchmarkNotes: seed.manual.benchmarkNotes,
    freshnessVerifiedAt: seed.manual.freshnessVerifiedAt,
    staleListingRisk: seed.manual.staleListingRisk,
    homeBasedFlag: seed.manual.homeBasedFlag,
    recurringRevenuePercent: seed.manual.recurringRevenuePercent,
    ownerHoursClaimed: seed.manual.ownerHoursClaimed,
    opsManagerExists: seed.manual.opsManagerExists,
    keyPersonRisk: seed.manual.keyPersonRisk,
    cashToCloseNotes: seed.manual.cashToCloseNotes,
    overallScore,
    notes: `${seed.notes}\n\n${buildAnalysisBlock(seed.analysis)}`,
    tags: seed.tags,
  } satisfies Prisma.BusinessCreateInput;
}

export const researchedListingSeeds = [
  {
    businessName:
      "Established Landscaping & Snow Removal Company | $500K SDE | 30+ Years",
    sourceUrl:
      "https://www.bizquest.com/business-for-sale/established-landscaping-and-snow-removal-company-500k-sde-30-years/BW2480416/",
    category: "outdoor services",
    subcategory: "landscaping and snow removal",
    location: "Wayne County, MI",
    stateCode: "MI",
    askingPrice: 1400000,
    revenue: 1000000,
    sde: 500000,
    ebitda: null,
    employees: null,
    summary:
      "Wayne County landscaping and snow removal company with more than 30 years of operating history, four full crews, recurring seasonal contracts, and included trucks, plows, trailers, and landscaping equipment.",
    whyItMayFit:
      "This is one of the strongest current brother-local candidates because the price-to-cash-flow math is workable, four crews imply a real field structure, and the Michigan cost base is friendlier than comparable Northeast platforms.",
    risks:
      "The page does not explicitly disclose a separate ops manager or employee count, snow and equipment still add seasonality and capex, and the customer mix appears to lean residential with only select commercial accounts.",
    brokerName: "Shmulie Shear",
    brokerFirm: "Hedgestone Advisors",
    listingSource: "BizQuest",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizQuest individual listing page with the exact requested title shows Wayne County MI, ask 1400000, SDE 500000, revenue 1000000, 30-plus years in business, residential and select commercial clients, recurring seasonal contracts, four full crews, lawn maintenance, mulch installation, seasonal cleanups, snow plowing, salting, trained crews, included trucks/plows/trailers/landscaping equipment, leased real estate, and stated growth paths through more commercial maintenance contracts, more crews, and more snow work. Inference: this looks like one of the best currently validated brother-local / buyer-remote fits because the economics are strong enough to matter, the service mix is highly AI-resistant, the four-crew language suggests real field delegation, and the lower-cost Michigan operating base is friendlier than the capital-heavier Northeast alternatives. Missing: exact employee count, the true split between recurring maintenance and one-time work, whether any crew leads or office staff already absorb owner scheduling and customer communication, customer concentration inside the snow book, and normalized annual fleet and equipment replacement spending. Top 3 follow-up questions: 1) Who runs routing, crew dispatch, and customer communication today when the owner is not in the field? 2) What percentage of gross profit comes from recurring maintenance and snow contracts versus one-time seasonal jobs or enhancement work? 3) What does normalized maintenance capex look like across trucks, plows, trailers, and landscaping equipment over a full cycle?",
    tags: [
      "landscaping",
      "snow-removal",
      "michigan",
      "four-crews",
      "recurring-contracts",
      "brother-operator-fit",
      "top-tier-fit",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 5,
      brotherOperatorFitRating: 5,
    },
    manual: {
      aiResistanceScore: 4,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 4,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 5,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Wayne looks like one of the best current brother-local / buyer-remote fits because the earnings cushion is stronger, the operating category is simpler to delegate, and the lower-cost Midwest setting helps relative to similarly sized Northeast platforms.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The ask is still meaningful, but the 2.8x-ish ask-to-SDE multiple plus Midwest cost base make the close-cash burden look more manageable than larger outdoor-service platforms, assuming equipment condition and working-capital needs hold up.",
    },
    analysis: {
      thesisFit:
        "One of the strongest currently verified brother-local / buyer-remote fits in the tracker.",
      mainReasons:
        "The economics are real, the category is highly physical and AI-resistant, and the four-crew operating structure is much closer to a delegated field platform than a seller-shaped solo trade job.",
      failureModes:
        "The public page still leaves room for hidden owner dependence if crew leadership, customer communication, or snow relationships sit too heavily with the seller.",
      keepDayJobView:
        "Very good because the cash flow is real enough and the operational shape is crew-based rather than hero-technician based, assuming the owner is not still the universal dispatcher and sales point.",
      quitDayJobView:
        "Also very good because the earnings appear large enough to matter even after debt, brother compensation, and equipment reserves.",
      benchmarkComparison:
        "It grades near the top of the tracker because it combines strong economics with a more affordable operating context than Clifton, while still needing more diligence on management depth than the headline suggests.",
      confidence:
        "Confidence is good on the core public facts, but still incomplete on employee count, management structure, contract mix, and capital-spend normalization.",
    },
  },
  {
    businessName:
      "Established Landscaping, Snow Plowing, Hardscape & Concrete Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-landscaping-snow-plowing-hardscape-and-concrete-company/2445240/",
    category: "outdoor services",
    subcategory: "landscaping, snow plowing, hardscape, and concrete",
    location: "Clifton, NJ",
    stateCode: "NJ",
    askingPrice: 2999999,
    revenue: 5000000,
    sde: 800000,
    ebitda: null,
    employees: 40,
    summary:
      "Clifton landscaping, snow, hardscape, and concrete company with more than 40 employees, 25-plus years of operating history, and an established management team on a 3-plus-acre leased yard.",
    whyItMayFit:
      "This is one of the strongest currently validated brother-local candidates because the scale, management depth, contract coverage, and essential outdoor-service mix look much more transferable than a typical owner-led trade listing.",
    risks:
      "The $3.0M entry price raises the equity bar, New Jersey cost structure is heavier than Midwest alternatives, and snow plus project work still create seasonality, equipment intensity, and execution complexity.",
    brokerName: "Brandon Kirch",
    brokerFirm: "Sunbelt",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: a current live BizBuySell page with the exact requested title shows Clifton NJ (Passaic County), ask 2999999, revenue 5000000, SDE 800000, 40+ employees, 25+ years in business, SBA financing available for qualified buyers, 1800000 of assets included, about 900000 of annual snow-plowing revenue, 3-year snow contracts in place, a 3+ acre leased industrial yard, 10 years remaining on the lease, 7000 per month of sublet income, and an established management team that keeps the owner in an oversight role rather than daily field work. Inference: this is a very strong large-scale contender for the brother-local thesis because the public page shows real crew depth, route and contract infrastructure, and second-layer leadership instead of a seller-shaped owner job. Missing: the exact split between recurring maintenance revenue and harder-to-manage project revenue, the roles and retention risk of the key managers or foremen, customer concentration across commercial, municipal, and residential accounts, and how much winter profitability depends on a few large snow relationships. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance and snow contracts versus hardscape and concrete project work? 2) Who are the key managers and foremen, what do they own today, and are they committed post-close? 3) How concentrated are the top commercial and municipal customers, especially inside the snow book and any multi-year contracts?",
    tags: [
      "landscaping",
      "snow-plowing",
      "hardscape",
      "concrete",
      "new-jersey",
      "management-team",
      "capital-heavy",
      "brother-operator-fit",
      "sba-financing",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 5,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 3,
      capexRisk: 5,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This Clifton company appears to beat the benchmark on scale, team depth, contract infrastructure, and transferability, but it is still more capital-heavy and more exposed to snow and project execution risk than the cleanest thesis fits.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 2,
      cashToCloseNotes:
        "SBA availability helps, but a realistic buyer still needs to underwrite a much larger equity check plus working capital, fleet refresh, winter payroll, and any covenant requirements tied to the leased yard and sublet income.",
    },
    analysis: {
      thesisFit:
        "One of the strongest currently validated large-scale fits for a brother-local / buyer-remote structure.",
      mainReasons:
        "The public page shows a real management layer, a 40-plus-person workforce, contract-backed snow revenue, and meaningful operating infrastructure.",
      failureModes:
        "Project-heavy revenue, key-manager turnover, customer concentration, or snow-margin volatility could make the apparent transferability less durable than the headline looks.",
      keepDayJobView:
        "Good because the management-team language and workforce depth make remote ownership more believable than most field-service listings.",
      quitDayJobView:
        "Very good because the cash flow is substantial enough to matter even after debt and professionalized management, assuming the contract mix and team depth hold up.",
      benchmarkComparison:
        "It looks stronger than the current benchmark on scale and delegation, while still trailing the best hypothetical Midwest version of this model because New Jersey is more capital-intensive and expensive.",
      confidence:
        "Confidence is fairly high on the public facts because the listing is detailed, but still incomplete on customer mix, winter margins, and exact management responsibilities.",
    },
  },
  {
    businessName:
      "Scalable Landscaping Platform | 50% Recurring Revenue | Tampa",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/scalable-landscaping-platform-50-recurring-revenue-tampa/2479308/",
    category: "outdoor services",
    subcategory: "commercial landscape maintenance",
    location: "Tampa, FL",
    stateCode: "FL",
    askingPrice: 1800000,
    revenue: 1320000,
    sde: 447000,
    ebitda: null,
    employees: 20,
    summary:
      "Tampa landscaping platform with 20 full-time employees, about 50 percent recurring monthly maintenance revenue, diversified lawn/tree/irrigation services, and minimal customer concentration across the metro area.",
    whyItMayFit:
      "This is a real contender because the recurring-maintenance base, 20-person crew structure, and route-density upside fit the brother-local model better than a one-owner landscaping shop, even if it sits below Wayne and Clifton.",
    risks:
      "The public page does not spell out a second layer of management, the customer mix between residential and commercial work is not explicit, and the $1.8M price still leaves less earnings cushion than Wayne.",
    brokerName: "Corey Goodlander",
    brokerFirm: "8th Street Partners",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizBuySell page with the exact requested title shows Tampa FL, ask 1800000, SDE 447000, revenue 1320000, 20 full-time employees, established in 1987, about 50 percent recurring monthly maintenance revenue, diversified lawn maintenance/landscaping/tree services/irrigation offerings, top five customers at only about 10 percent of revenue, an asset-light crew-based structure, six trucks or dump trucks plus mowers/trailers and related equipment, and growth angles through densification, more crews, digital marketing, and modern field-service software. Inference: this is a real active contender because the recurring maintenance base and crew count make it more transferable than a small owner-led landscape company, but it still reads as a step below Wayne and Clifton because the listing does not clearly show a second management layer or the same earnings cushion. Missing: exact residential versus commercial customer mix, who currently handles routing and crew supervision, whether any foremen or office leaders can absorb owner removal, normalized equipment replacement spending, and how sticky the recurring contracts are by customer segment. Top 3 follow-up questions: 1) What percentage of revenue and gross profit comes from commercial maintenance versus residential accounts and enhancement work? 2) Who owns scheduling, route density, and crew oversight today, and is there a foreman or ops lead below the owner? 3) What does normalized annual capex and maintenance spending look like across trucks, dump trucks, trailers, mowers, and irrigation equipment?",
    tags: [
      "landscaping",
      "tampa",
      "recurring-revenue",
      "tree-services",
      "irrigation",
      "crew-based",
      "active-contender",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 4,
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
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Tampa looks more operationally aligned with the brother-local thesis because of its recurring route work and crew depth, but it still trails Wayne and Clifton because the public page is lighter on management depth and the earnings cushion is thinner.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: 50,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The asset-light language helps, but a realistic buyer still needs to reserve for crew retention, equipment upkeep, and route-density investments, so the effective close-cash burden is not as light as the headline may suggest.",
    },
    analysis: {
      thesisFit:
        "A real active contender, but still second tier relative to Wayne and Clifton.",
      mainReasons:
        "The recurring maintenance base, 20-person workforce, and dense Tampa route potential make the business more transferable than most subscale landscape listings.",
      failureModes:
        "If the owner still owns routing, estimating, and crew supervision, the apparent platform quality could prove thinner than the listing implies.",
      keepDayJobView:
        "Good because the recurring revenue mix and workforce size create a plausible remote-owner structure if there is real crew leadership below the seller.",
      quitDayJobView:
        "Also workable, though the economics leave less room for error than Wayne once debt, brother compensation, and fleet reserves are layered in.",
      benchmarkComparison:
        "It deserves to stay in the serious-active mix, but as a notch below Wayne and Clifton because the public page is less explicit on management depth and post-close cushioning.",
      confidence:
        "Confidence is fairly good on the public facts and still incomplete on customer mix, org chart, and normalized capex.",
    },
  },
].map((seed) => ({
  ...seed,
  managedBusinessData: buildManagedBusinessData(seed),
})) satisfies Array<
  ResearchedListingSeedInput & {
    managedBusinessData: Prisma.BusinessCreateInput;
  }
>;
