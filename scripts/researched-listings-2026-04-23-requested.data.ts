import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const RESEARCHED_LISTING_BATCH_DATE = "2026-04-23";
export const RESEARCHED_LISTING_NOTE_HEADING = `Backfill analysis (${RESEARCHED_LISTING_BATCH_DATE})`;
export const RESEARCHED_LISTING_VERIFIED_AT = new Date(
  "2026-04-23T15:30:00-04:00",
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
      "Established Landscape company with 40 years in business and solid Hist",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-landscape-company-with-40-years-in-business-and-solid-hist/2460333/",
    category: "outdoor services",
    subcategory: "landscaping and snow removal",
    location: "Plymouth County, MA",
    stateCode: "MA",
    askingPrice: 2600000,
    revenue: 2100000,
    sde: 800000,
    ebitda: null,
    employees: 18,
    summary:
      "Plymouth County landscaping company founded in 1985 with 18 employees, diversified lawn care, snow removal, property maintenance, landscape design, and hardscaping work.",
    whyItMayFit:
      "Strong absolute cash flow, a real team, long operating history, and a year-round outdoor-service mix make this a useful retained comp against Wayne and Clifton even though the buy-in is materially heavier.",
    risks:
      "The entry price is much higher than Wayne, the service mix likely carries more project complexity than a maintenance-first operator, and the Northeast labor and equipment cost base is heavier.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizBuySell page shows Plymouth County MA, ask 2600000, SDE 800000, revenue 2100000, established 1985, 18 employees split across 15 full-time and 3 part-time, FF&E of 500000 included, a 1200 square foot building with a 30000 square foot lot, leased real estate, and diversified services spanning commercial and residential lawn care, snow removal, property maintenance, landscape design, and hardscaping. Inference: this looks like a credible scale comp for larger outdoor-service platforms because the public page suggests real workforce depth, broad service coverage, and a retiring owner after roughly 40 years, but it still reads as a more capital-heavy operating company than Wayne. Missing: the split between recurring maintenance and project revenue, who runs crews and customer communication below the owner, how much snow contributes to normalized profit, and what annual fleet replacement spending looks like. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance and snow versus design, hardscape, and other project work? 2) Who currently owns routing, crew management, and key customer communication when the owner is unavailable? 3) What does normalized annual capex look like across trucks, snow assets, and landscaping equipment?",
    tags: [
      "comp-only",
      "landscaping",
      "snow-removal",
      "hardscape",
      "massachusetts",
      "scaled-team",
      "long-history",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Competes on scale and raw SDE, but it does not beat Wayne on ask-to-SDE efficiency, capital burden, or apparent simplicity.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The raw earnings are strong, but a realistic buyer still has to carry a much larger equity check plus working capital, snow equipment, and fleet reserves than the cleaner Wayne-style path.",
    },
    analysis: {
      thesisFit:
        "A credible high-end comp for larger landscaping and snow operators, but not a cleaner default-pipeline fit than the best active leaders.",
      mainReasons:
        "The company has real scale, long history, diversified outdoor-service lines, and enough earnings to matter as a benchmarking record.",
      failureModes:
        "If too much profit comes from harder-to-scale project work or if the seller still owns dispatch, estimating, and key customer relationships, the transferability could be weaker than the headline implies.",
      keepDayJobView:
        "Only fair because the scale is meaningful, but the higher price and likely operational sprawl make remote ownership riskier than Wayne or Clifton.",
      quitDayJobView:
        "Better, because there is enough earnings power to support a full-time operator if the management depth is real.",
      benchmarkComparison:
        "Useful as a scale comp, but Wayne still looks cleaner on affordability, delegation risk, and likely transition simplicity.",
      confidence:
        "Confidence is solid on the public headline facts, but incomplete on contract mix, management depth, and normalized capex.",
    },
  },
  {
    businessName:
      "High-Margin Landscaping Co. with Route Density in Growth Corridor",
    sourceUrl:
      "https://www.bizquest.com/business-for-sale/high-margin-landscaping-co-with-route-density-in-growth-corridor/BW2475102/",
    category: "outdoor services",
    subcategory: "landscaping",
    location: "Spicewood / Marble Falls, TX",
    stateCode: "TX",
    askingPrice: 1700000,
    revenue: 1774000,
    sde: 500000,
    ebitda: null,
    employees: null,
    summary:
      "Texas Hill Country landscaping company serving affluent communities with recurring maintenance, irrigation, and install work, about 75 percent recurring revenue, and public seller-financing language.",
    whyItMayFit:
      "This is one of the closest new public landscaping comps to Wayne on pure economics because the earnings are similar, recurring revenue looks strong, and the route-density story is attractive, but it is now most useful as a sale-pending comparison row.",
    risks:
      "The live page is marked Sale Pending, employee count is not public, and the install/design mix could add more complexity than the recurring-maintenance headline suggests.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizQuest",
    dealStatus: DealStatus.LETTER_OF_INTENT,
    notes:
      "Observed: the live BizQuest individual page shows Spicewood Texas in Travis County, a Sale Pending banner, seller financing available, ask 1700000, revenue 1774000, SDE of about 500000 in the business description, roughly 75 percent recurring contractual clients, landscape design and installation plus irrigation and recurring maintenance work, included inventory and FF&E, real estate available separately, and growth through dense luxury-community routes plus nearby housing development. Inference: this is still a very useful Wayne-style economics comp because the recurring percentage and route-density language are strong, but under current tracker conventions it should preserve pending context rather than pretend to be a clean live target. Missing: employee count, the mix of recurring maintenance versus enhancement gross profit, whether there is a true foreman or office layer below the owner, and how much of the route-density advantage depends on the related real-estate footprint. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance versus installations, irrigation, and enhancement work? 2) Who owns scheduling, route density, and crew supervision today, and is there a real lead below the owner? 3) How dependent is the operating model on the separate real-estate footprint and employee-housing setup?",
    tags: [
      "comp-only",
      "landscaping",
      "texas",
      "route-density",
      "recurring-revenue",
      "seller-financing",
      "hill-country",
      "pending",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 5,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "The live BizQuest page explicitly says seller financing is available.",
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Closest new comp to Wayne on economics, but still pricier on ask-to-SDE and currently sale pending.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: false,
      recurringRevenuePercent: 75,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "If the deal reopens, the seller-financing language and recurring base help the story, but any buyer still needs to underwrite the optional real estate, route-density assumptions, and landscape labor retention carefully.",
    },
    analysis: {
      thesisFit:
        "A strong retained economics comp that would have been near the serious-active mix if the live page were not already marked pending.",
      mainReasons:
        "The 75 percent recurring-revenue claim, route-density story, and seller-financing language make it one of the most relevant public comparisons to Wayne.",
      failureModes:
        "The install and irrigation mix may be more owner-shaped than the route language suggests, and the undisclosed org chart could hide more dependence than the listing copy implies.",
      keepDayJobView:
        "Good in theory because the recurring mix is attractive, but less actionable now because the page is already sale pending.",
      quitDayJobView:
        "Also good in theory, though still dependent on whether a real field-leadership layer exists below the seller.",
      benchmarkComparison:
        "As a pure comp, it is one of the closest new Wayne-style reference points, but the live pending status prevents it from belonging in the default active pipeline.",
      confidence:
        "Confidence is good on recurring mix, pricing, and pending status, but weak on headcount, org chart, and exact cash-flow support because part of the page is gated.",
    },
  },
  {
    businessName:
      "Established Commercial Landscaping — KC Metro — Recurring Contracts",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-commercial-landscaping-kc-metro-recurring-contracts/2494710/",
    category: "outdoor services",
    subcategory: "commercial landscaping",
    location: "Kansas City, MO",
    stateCode: "MO",
    askingPrice: 1650000,
    revenue: 1506000,
    sde: 447000,
    ebitda: null,
    employees: null,
    summary:
      "Kansas City commercial landscaping company built around recurring commercial, HOA, and municipal contracts, plus snow, irrigation, plant health, and construction work with an H-2B labor program.",
    whyItMayFit:
      "Commercial recurring contracts, year-round service lines, and the H-2B labor program make this a serious structural comparison candidate for larger brother-operator landscaping platforms.",
    risks:
      "Real estate sits outside the ask, employee count is not public, and the service mix may still hide more operational complexity than a simpler maintenance-first business.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizBuySell page shows Kansas City MO, ask 1650000, SDE 447000, revenue 1506000, established 2018, no residential customers, recurring contracts with commercial properties, HOAs, and municipal accounts, five service divisions spanning maintenance, snow removal, plant health care, construction, and irrigation, an established H-2B worker program with returning crews, more than 920000 of inventory included, a 6000 square foot facility, real estate available separately, and seller financing plus SBA terms. Inference: this is a high-quality commercial landscaping comparison row because the public page suggests a structured labor engine and commercial contract base rather than a small owner-led lawn route. Missing: exact headcount, the share of gross profit tied to recurring maintenance versus project work, who runs day-to-day field operations, and whether the H-2B program creates meaningful seasonal execution or compliance concentration. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance and snow versus construction, irrigation, and plant-health work? 2) Who owns estimating, scheduling, and customer retention below the seller today? 3) What operational or compliance risk is concentrated inside the H-2B labor model?",
    tags: [
      "comp-only",
      "landscaping",
      "commercial",
      "snow-removal",
      "kansas-city",
      "h2b",
      "recurring-contracts",
      "municipal",
      "seller-financing",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 5,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "The live BizBuySell page says seller financing is available and also mentions SBA terms.",
      operatorSkillDependency: 3,
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
        "Good commercial recurring structure, but Wayne still wins on listed price-to-SDE and likely simplicity.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Seller-financing language helps, but the fleet, H-2B program, and separate real estate still make this a more structured and capital-aware underwrite than a simpler maintenance shop.",
    },
    analysis: {
      thesisFit:
        "A strong commercial landscaping structure comp with more systems depth than many public outdoor-service listings.",
      mainReasons:
        "Recurring commercial contracts, municipal exposure, snow diversification, and a formal labor program make it a serious operational benchmark.",
      failureModes:
        "The apparent structure could still conceal project-heavy gross profit, seasonal labor concentration, or owner dependence in estimating and customer retention.",
      keepDayJobView:
        "Good relative to many landscaping listings because the contract base and labor-program language imply more process, but still not as clean as the most affordable active fits.",
      quitDayJobView:
        "Also good, assuming the operational systems and returning crews are as durable as the page suggests.",
      benchmarkComparison:
        "It is an excellent commercial-structure comp, but Wayne remains the cleaner blend of affordability, earnings cushion, and likely transition risk.",
      confidence:
        "Confidence is good on the listed facts and contract shape, but incomplete on headcount, org chart, and project-versus-maintenance margins.",
    },
  },
  {
    businessName:
      "39-Year Landscaping Business – Loyal Clients & High Profits",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/39-year-landscaping-business-loyal-clients-and-high-profits/2485754/",
    category: "outdoor services",
    subcategory: "landscaping and tree services",
    location: "Scottsdale, AZ",
    stateCode: "AZ",
    askingPrice: 1620000,
    revenue: 2045116,
    sde: 472811,
    ebitda: null,
    employees: 20,
    summary:
      "Scottsdale-area landscaping company established in 1987 with repeat clients, 20 full-time employees, premium maintenance work, and a profitable tree-service mix.",
    whyItMayFit:
      "Long history, repeat clients, and meaningful earnings make it a legitimate national landscaping comp with more scale than many smaller public listings.",
    risks:
      "The owner is still active in the field, tree services add skill and equipment complexity, and the home-based setup plus premium local relationships may make transition riskier than Wayne-style route operators.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizBuySell page shows ask 1620000, SDE 472811, revenue 2045116, established 1987, a Scottsdale-area landscaping and tree-service business with a 70 percent residential and 30 percent commercial mix, 20 full-time employees, dedicated maintenance and installation crews, a home-based office, about 700000 of inventory not included in the asking price, and an owner who remains active in the field. Inference: this is a real longevity-and-earnings comp, but it looks more owner-shaped than the best brother-local fits because tree service profitability and quality control may still sit heavily with the seller. Missing: the exact split between maintenance and tree-service profit, whether any foremen can absorb owner removal, customer concentration inside the repeat-client base, and what normalized equipment and vehicle replacement spending looks like. Top 3 follow-up questions: 1) How much gross profit comes from recurring maintenance routes versus tree-service and installation work? 2) Which foremen or crew leads could keep operations moving if the owner stepped out of the field? 3) What does normalized annual capex look like when tree-service equipment, trucks, and mobile crew assets are included?",
    tags: [
      "comp-only",
      "landscaping",
      "tree-services",
      "scottsdale",
      "arizona",
      "repeat-clients",
      "long-history",
      "home-based",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 3,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Valid comp on earnings and longevity, but not as clean a Wayne-style brother-operator fit.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The headline earnings are real, but the active-owner posture, excluded inventory, and tree-service complexity make the true close-cash and transition burden less clean than the top landscaping comps.",
    },
    analysis: {
      thesisFit:
        "A worthwhile national landscaping comp on longevity and earnings, but not a top-tier transferability fit under the current thesis.",
      mainReasons:
        "The business has decades of reputation, repeat clients, a full team, and enough cash flow to matter as a retained comparison record.",
      failureModes:
        "If the owner still anchors client trust, quality control, and tree-service execution, the apparent earnings quality may be less transferable than the public page suggests.",
      keepDayJobView:
        "Only moderate because the owner-active language and home-based setup raise more transition risk than the best crew-led comps.",
      quitDayJobView:
        "Better, because a hands-on local operator could still make the economics work if the team and client base are stable.",
      benchmarkComparison:
        "Useful as a long-history comp, but Wayne remains the cleaner brother-local template because it reads as more delegated and less seller-shaped.",
      confidence:
        "Confidence is good on the financials and staffing, but still limited on management depth and the exact role of tree services in the profit mix.",
    },
  },
  {
    businessName:
      "Highly Profitable Full-Service Landscaping & Snow Removal Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/highly-profitable-full-service-landscaping-and-snow-removal-company/2484806/",
    category: "outdoor services",
    subcategory: "landscaping and snow removal",
    location: "Suffolk County, NY",
    stateCode: "NY",
    askingPrice: 3200000,
    revenue: 2000000,
    sde: 895000,
    ebitda: null,
    employees: null,
    summary:
      "Long Island full-service landscaping and snow removal company with recurring maintenance, commercial and residential work, and nearly 900000 of owner earnings.",
    whyItMayFit:
      "Very strong raw earnings and a full-service outdoor mix make this a valid high-end comp to Wayne and Clifton when benchmarking larger landscaping platforms.",
    risks:
      "The entry price is heavy, Long Island costs are likely elevated, the page is light on team-depth detail, and the full-service mix may be too capital-intensive for a cleaner Wayne-style path.",
    brokerName: "James Bissett",
    brokerFirm: "Hedgestone Advisors",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: the live BizBuySell page shows Suffolk County NY, ask 3200000, SDE 895000, revenue 2000000, a Long Island landscaping company with commercial contracts, residential maintenance, landscape design, masonry projects, winter snow removal, recurring contract revenue, year-round revenue streams, experienced crews and systems in place, support and training available, and a new building open for purchase or rent. Inference: this is a legitimate large-scale outdoor-services comp because the public page pairs strong owner earnings with recurring maintenance and winter work, but it still under-discloses management depth relative to Clifton and Wayne. Missing: employee count, whether there is a true management layer or just experienced crews, the mix between recurring maintenance and project gross profit, customer concentration, and normalized capital spending across trucks, equipment, and snow assets. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance and snow versus design and masonry project work? 2) Who actually runs day-to-day crews, estimating, and customer relationships below the owner? 3) What does normalized annual fleet and snow-equipment replacement spending look like in the Long Island operating context?",
    tags: [
      "comp-only",
      "landscaping",
      "snow-removal",
      "long-island",
      "suffolk-county",
      "high-sde",
      "full-service",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Huge SDE comp, but Wayne still looks cleaner on entry price, simplicity, and likely transition risk.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The cash flow is impressive, but a realistic buyer still has to carry a very large equity need plus Long Island labor, fleet, and winter-capex exposure.",
    },
    analysis: {
      thesisFit:
        "A very strong high-end landscaping benchmark comp, but too capital-heavy to outrank the cleaner active leaders under the current thesis.",
      mainReasons:
        "The owner earnings, recurring-contract language, and year-round service mix make it useful for comparing larger outdoor-service platforms.",
      failureModes:
        "If the experienced-crew language masks thin management depth or if too much profit depends on project work and a few snow relationships, the transferability could be weaker than the earnings suggest.",
      keepDayJobView:
        "Only fair because the capital load and operating scale demand more confidence in second-layer leadership than the public page currently gives.",
      quitDayJobView:
        "Strong, because the earnings are large enough to support a full-time operator if the crew and contract base are durable.",
      benchmarkComparison:
        "Excellent for benchmarking scale and raw SDE, but Wayne still wins on affordability, simplicity, and likely transition risk.",
      confidence:
        "Confidence is good on the top-line economics and service mix, but weaker on management depth, customer concentration, and staffing.",
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
