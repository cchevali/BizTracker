import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const RESEARCHED_LISTING_BATCH_DATE = "2026-04-12";
export const RESEARCHED_LISTING_NOTE_HEADING = `Backfill analysis (${RESEARCHED_LISTING_BATCH_DATE})`;
export const RESEARCHED_LISTING_VERIFIED_AT = new Date(
  "2026-04-12T12:00:00-04:00",
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
      "23 FedEx Ground Routes - Buffalo, NY - Seller & Vehicle Financing",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/23-fedex-ground-routes-buffalo-ny-seller-and-vehicle-financing/2452419/",
    category: "route services",
    subcategory: "fedex ground routes",
    location: "Buffalo, NY",
    stateCode: "NY",
    askingPrice: 1250000,
    revenue: 3064301,
    sde: 778331,
    ebitda: 778331,
    employees: null,
    summary:
      "Buffalo FedEx Ground package with 23 contiguous routes, a full-time manager already in place, seller and vehicle financing called out publicly, and home-based semi-absentee positioning.",
    whyItMayFit:
      "This is one of the strongest route-style income-replacement candidates seen so far because it combines real disclosed cash flow, scale, and a manager-in-place setup instead of an owner-driver story.",
    risks:
      "FedEx concentration, truck replacement timing, driver retention, and the risk that the semi-absentee framing depends too heavily on one manager still matter a lot here.",
    brokerName: "Alex Beringer",
    brokerFirm: "FXG Management, Inc.",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1250000, revenue 3064301, SDE and EBITDA 778331, Buffalo NY location, 23 contiguous FedEx Ground routes, home-based structure, one truck and one experienced driver per route, full-time manager in place, and listing language that points to double-digit annual growth plus semi-absentee ownership. Seller financing is described as roughly 550000 from the seller plus an estimated 550000 in vehicle financing with only about 150000 cash needed. Inference: this looks like the cleanest large route-business income-replacement candidate in the current tracker, but it is still a concentrated bet on FedEx economics, driver stability, and fleet condition rather than a low-drama passive asset. Missing: exact truck age-mileage profile, true route-by-route settlement history, terminal concentration, manager compensation-authority details, and whether any large service-score issue or contract renewal event is lurking behind the growth story. Top 3 follow-up questions: 1) What are the last 24 months of route settlements, safety-service metrics, and FedEx contractor notices by terminal and route cluster? 2) What does the truck replacement schedule look like over the next 24 to 36 months, and how much capex is deferred right now? 3) How much of the semi-absentee story depends on one manager versus documented dispatch-driver processes that a buyer can actually inherit?",
    tags: [
      "fedex",
      "ground-routes",
      "buffalo",
      "manager-in-place",
      "seller-financing",
      "home-based",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says roughly 550000 seller financing plus an estimated 550000 in vehicle financing and about 150000 cash from the buyer.",
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 4,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. This clearly beats the route benchmark for income replacement and delegated scale, even though it does so by taking on much more FedEx concentration and fleet risk.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The shared 14% to 20% model lands above the listing's headline 150000 cash pitch, which is appropriate because route reserves, transfer costs, and any softness in vehicle financing can still push the real equity need back toward the model range.",
    },
    analysis: {
      thesisFit:
        "Very strong route-business candidate for income replacement, though still not a no-drama passive ownership story.",
      mainReasons:
        "Disclosed SDE, meaningful scale, manager-in-place structure, and unusually friendly financing language make this much more serious than a typical owner-driver route listing.",
      failureModes:
        "FedEx dependency, driver-manager turnover, and a fleet refresh cycle can turn a great-looking route package into a cash sink quickly.",
      keepDayJobView:
        "Good if the manager and route bench are real because the organizational shape is finally large enough to plausibly keep ownership out of daily execution.",
      quitDayJobView:
        "Strong because the cash flow already clears the income-replacement bar by a wide margin.",
      benchmarkComparison:
        "This beats the current route benchmark on scale and earnings, but it also gives up the benchmark's simplicity and lower downside.",
      confidence:
        "Confidence is fairly good on the headline economics because the listing is concrete, but the route-level and fleet-level diligence still matters too much for high conviction today.",
    },
  },
  {
    businessName: "Ann Arbor Area Construction Business",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/ann-arbor-area-construction-business/2472256/",
    category: "construction services",
    subcategory: "residential/commercial construction",
    location: "Ann Arbor, MI",
    stateCode: "MI",
    askingPrice: 1600000,
    revenue: 4000000,
    sde: 650000,
    ebitda: 650000,
    employees: 6,
    summary:
      "Ann Arbor design-build and construction company with more than 40 years of operating history, six employees, longstanding subcontractor relationships, and a repair-maintenance division alongside project work.",
    whyItMayFit:
      "The cash flow is real enough to matter, the company is older than most broker-packaged listings, and the repair-maintenance angle is directionally better than a pure one-off project contractor.",
    risks:
      "This still looks much more operationally demanding than the listing's smooth transition language suggests because estimating, project management, seller relationships, and working-capital timing can all matter heavily.",
    brokerName: "John Naayers",
    brokerFirm: "Business Network Of Ohio LLC",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1600000, revenue 4000000, SDE and EBITDA 650000, Ann Arbor MI, six employees, 40+ year operating history, design-build plus construction-management positioning, a repair and maintenance division, experienced staff and long-standing subcontractor relationships, strong repeat-referral reputation, and seller financing available to a small degree. The office building is available to lease or purchase separately, FF&E of about 190000 is included, and the owners reportedly do almost no marketing today. Inference: this is a real company rather than a thin contractor shell, but it is still likely to be much more seller-relationship and estimating dependent than the headline numbers imply. Missing: revenue split between remodel-design-build work versus recurring repair-maintenance work, who actually estimates and sells jobs today, backlog and WIP quality, gross-margin volatility by project type, and whether any required licenses or permits are tied too closely to the current owners. Top 3 follow-up questions: 1) What percentage of revenue and gross profit comes from repeat repair-maintenance work versus one-off design-build projects? 2) Which jobs or customers still require direct owner estimating, design input, or relationship management? 3) What do backlog, open-job gross profit fade, and working-capital swings look like over the last 12 to 24 months?",
    tags: [
      "construction",
      "ann-arbor",
      "design-build",
      "repair-maintenance",
      "seller-financing",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
      transferabilityRating: 3,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller financing may be considered to a small degree.",
      operatorSkillDependency: 4,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Ann Arbor listing has better raw earnings, but the project-estimating and working-capital complexity make it a worse first-acquisition fit than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The standard model likely understates real equity needs here because WIP timing, retainage, inventory exclusions, and any separately negotiated real-estate decision can all widen the actual cash requirement.",
    },
    analysis: {
      thesisFit:
        "Trackable because the earnings and operating history are real, but still clearly outside the cleaner route-home-service lane.",
      mainReasons:
        "Long tenure, decent cash flow, and an existing staff-subcontractor network give it more substance than a typical small contractor listing.",
      failureModes:
        "Seller-led estimating, backlog quality issues, and project-margin drift could make the business far less transferable than it appears on paper.",
      keepDayJobView:
        "Poor because construction execution and estimating almost always pull ownership into day-to-day involvement.",
      quitDayJobView:
        "Good only if the current team truly carries production and the owner is already mostly out of project execution.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is a simpler, more repeatable operating model even at lower earnings.",
      confidence:
        "Confidence is decent on the headline facts, but the transferability judgment is still only moderate until role clarity and segment mix are surfaced.",
    },
  },
  {
    businessName: "Pittsburgh, PA - Multi Unit Auto Paint Business",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/pittsburgh-pa-multi-unit-auto-paint-business/2238298/",
    category: "auto services",
    subcategory: "collision / auto paint franchise",
    location: "Pittsburgh, PA",
    stateCode: "PA",
    askingPrice: 1725000,
    revenue: 4312500,
    sde: null,
    ebitda: 690000,
    employees: 11,
    summary:
      "Pittsburgh multi-unit auto paint and collision franchise with 11 employees, diversified retail plus fleet revenue, franchise systems, and a scalability pitch aimed at multi-unit operators.",
    whyItMayFit:
      "This is clearly more platform-like than a single-shop body shop because the listing frames it as a multi-unit system with fleet revenue and a proven playbook.",
    risks:
      "SDE is undisclosed, franchise economics matter, and collision-auto paint operations can hide a lot of manager, insurer, and workflow complexity behind a clean EBITDA number.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1725000, revenue 4312500, EBITDA 690000, SDE not disclosed, Pittsburgh PA, 11 employees, established franchise positioning, diversified retail and significant fleet revenue, multi-unit scalability language, comprehensive training-support, and owned real estate listed on the page without clear public detail on whether it is included in the ask. Inference: this is more interesting than a generic owner-operated body shop because it may already have some scale and process, but the missing SDE and hidden unit-level economics leave too much room for the EBITDA story to flatter reality. Missing: exact number of operating units, true owner cash after franchise royalties and any manager overhead, same-store sales trends, unit-level margin spread between retail and fleet work, and how dependent the current results are on a seller or lead estimator maintaining key insurer-fleet relationships. Top 3 follow-up questions: 1) What is true trailing twelve month SDE after all franchise fees, local management payroll, and normalized owner replacement costs? 2) How many units are included, and what are revenue-EBITDA-store contribution figures by location? 3) How concentrated are the fleet and referral relationships, and who currently owns those relationships operationally?",
    tags: [
      "auto-paint",
      "collision",
      "pittsburgh",
      "franchise",
      "fleet-accounts",
      "sde-undisclosed",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
      transferabilityRating: 3,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 2,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Pittsburgh business is larger, but missing SDE plus franchise-collision complexity keep it well behind the benchmark for practical first-deal fit.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Because SDE is undisclosed and the real-estate treatment is unclear, the shared model is only a rough baseline here; franchise transfer fees, paint-booth equipment needs, and any working-capital gap could raise the real equity requirement.",
    },
    analysis: {
      thesisFit:
        "Potentially meaningful operator business, but operationally heavier and less transparent than the cleaner service-business targets.",
      mainReasons:
        "Multi-unit framing, fleet revenue, and franchise systems at least create the possibility of a scalable platform instead of a one-shop owner trade.",
      failureModes:
        "Hidden SDE, weak local leadership, and insurer-fleet concentration can quickly unravel the apparent scalability story.",
      keepDayJobView:
        "Poor because collision and fleet-account operations still look too manager-sensitive for believable sidecar ownership from public facts alone.",
      quitDayJobView:
        "Reasonable only if the unit managers are strong and the undisclosed owner cash actually supports the purchase price.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is simpler, smaller, and much easier to underwrite from public information.",
      confidence:
        "Confidence is moderate at best because the listing gives enough shape to track but not enough cash-flow detail to trust yet.",
    },
  },
  {
    businessName:
      "Healthcare Staffing Agency for Sale, 5+M in Revenue with 60+ staffs",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/healthcare-staffing-agency-for-sale-5-m-in-revenue-with-60-staffs/2478818/",
    category: "staffing",
    subcategory: "healthcare staffing",
    location: "White Bear Lake, MN",
    stateCode: "MN",
    askingPrice: 4500000,
    revenue: 5500000,
    sde: 1300000,
    ebitda: null,
    employees: 59,
    summary:
      "White Bear Lake healthcare staffing agency focused on skilled nursing placements, with 59 employees, ongoing facility contracts, and systems already in place for recruitment, scheduling, billing, credentialing, and compliance.",
    whyItMayFit:
      "The size of the cash flow and the fact pattern around ongoing facility relationships make it a real business rather than a thin startup listing, and the systems language is directionally what you want in labor-heavy operations.",
    risks:
      "Healthcare staffing is still a weak thesis fit because payroll float, compliance, workers comp, turnover, and around-the-clock schedule issues can overwhelm the attractive SDE headline quickly.",
    brokerName: "Mizpah Chi",
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 4500000, revenue 5500000, SDE 1300000, EBITDA not disclosed, White Bear Lake MN, established 2025, 59 employees made up of 51 full-time and 8 part-time staff, skilled nursing focus across RNs, LPNs, and CNAs, ongoing contracts with multiple healthcare facilities, and stated systems for recruitment, credentialing, scheduling, billing, and compliance. The listing also says 70 to 80% upfront, which is a financing negative rather than a financing positive, and the support section is dominated by compliance-regulatory training. Inference: this could be a real cash-generating staffing platform, but it is a poor clean-fit first acquisition because labor availability, compliance failures, and payroll-working-capital stress can all hurt much faster than the headline SDE suggests. Missing: facility concentration, gross margin by worker type, workers compensation and claims history, payroll timing versus collections, branch-management depth, and how much of recruiting-scheduling still depends on the current owner. Top 3 follow-up questions: 1) What are the top facility concentrations, contract terms, cancellation rights, and gross margins by major customer? 2) What do weekly payroll float, bad debt, workers comp costs, and any AR factoring or line usage look like in practice? 3) Who owns day-to-day recruiting, scheduling, and compliance today, and how much of that burden is truly transferable away from the seller?",
    tags: [
      "staffing",
      "healthcare",
      "white-bear-lake",
      "compliance-heavy",
      "labor-intensive",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 2,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 2,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: false,
      sellerFinancingNotes:
        "Listing says 70 to 80% upfront, which implies a heavy equity requirement rather than meaningful seller financing support.",
      operatorSkillDependency: 3,
      licenseDependency: 4,
      afterHoursBurden: 5,
      capexRisk: 1,
      regretIfWrongScore: 1,
      dataConfidenceScore: 4,
      keepDayJobFit: 1,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The staffing agency is much larger on paper, but the labor-compliance burden and implied heavy equity requirement make it a weaker first-acquisition fit than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The listing's 70% to 80% upfront language suggests the real equity need may land far above the normal 14% to 20% tracker model once payroll float and lender caution around staffing are accounted for.",
    },
    analysis: {
      thesisFit:
        "Worth tracking only because the cash flow is large; otherwise it sits well outside the cleaner boring-business thesis.",
      mainReasons:
        "Facility contracts, a sizable labor base, and working internal systems mean this is at least a real operating company with genuine scale.",
      failureModes:
        "Turnover, compliance mistakes, payroll float, and customer concentration can punish staffing businesses much faster than the top-line numbers suggest.",
      keepDayJobView:
        "Very poor because staffing problems and compliance issues do not respect normal working hours.",
      quitDayJobView:
        "Only moderate because the business can replace income, but it likely does so by buying a much more stressful operator role.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark keeps the first-deal thesis inside a simpler operational box with less regulatory and labor chaos.",
      confidence:
        "Confidence is solid on the public headline facts, but confidence is intentionally low on thesis fit because too many of the real staffing risks still sit behind the page.",
    },
  },
  {
    businessName:
      "AI-Enhanced Aesthetic and Wellness Brand with Strong Client Retention",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/ai-enhanced-aesthetic-and-wellness-brand-with-strong-client-retention/2467612/",
    category: "wellness",
    subcategory: "aesthetics / wellness",
    location: "Raleigh, NC",
    stateCode: "NC",
    askingPrice: 1080793,
    revenue: 2075123,
    sde: 643288,
    ebitda: null,
    employees: 8,
    summary:
      "Raleigh aesthetic and wellness business founded in 2024, with eight employees, a membership model, and multi-week tracked treatment programs positioned around strong client retention.",
    whyItMayFit:
      "The recurring membership framing, real disclosed cash flow, and eight-person team make it more substantive than a tiny solo medspa-style listing.",
    risks:
      "This is still a weak fit for the current thesis because it looks trend-driven, recently founded, brand-marketing sensitive, and potentially more license-clinical dependent than the listing makes obvious.",
    brokerName: "Chas Sima",
    brokerFirm: "Badger State Business Exchange",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1080793, revenue 2075123, SDE 643288, EBITDA not disclosed, Raleigh NC, established 2024, eight full-time employees, membership model, and structured 8 to 14 week client programs that combine light, sound, hydration, and regenerative therapies. The listing pitches strong retention, adjacent-market expansion, and seller training that covers staff management, customer issues, payroll, billing, and interpreting financial results. Inference: this could be a decent recurring consumer-services business on paper, but it is notably less aligned with the boring physical-world thesis because the brand is new, the category feels trend-sensitive, and the real license-clinical dependency is still fuzzy from public facts. Missing: exact recurring membership share of revenue, treatment mix and any required clinical oversight, customer-acquisition cost and retention cohort data, medical-director or provider dependency if any, and how much the recent growth is launch momentum rather than durable repeat demand. Top 3 follow-up questions: 1) What percentage of revenue is truly recurring membership revenue, and what are churn, average tenure, and payback by customer cohort? 2) Which treatments require licensed providers, medical oversight, or specialized certifications, and who currently holds those relationships? 3) How much of the 2024 to 2026 growth came from founder-led launch marketing versus durable word-of-mouth and retained-member economics?",
    tags: [
      "wellness",
      "aesthetics",
      "raleigh",
      "membership-model",
      "recently-founded",
      "trend-risk",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 4,
      transferabilityRating: 2,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 2,
    },
    manual: {
      aiResistanceScore: 4,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 4,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Even with good cash flow, the wellness listing is newer, more brand-driven, and less aligned with the benchmark's practical boring-business thesis.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The shared model is a reasonable starting point, but recent-vintage performance, equipment needs, and any hidden clinical-oversight requirements could make lenders or buyers demand more caution than the simple cash range suggests.",
    },
    analysis: {
      thesisFit:
        "Interesting enough to track, but clearly weaker than the current boring-business benchmarks.",
      mainReasons:
        "The membership model and disclosed SDE mean it at least has recurring-revenue potential instead of being a pure one-off treatment shop.",
      failureModes:
        "Trend decay, founder-brand dependence, and any hidden clinical-licensing requirements can all break the story faster than the retention marketing copy implies.",
      keepDayJobView:
        "Poor because this still looks too brand and customer-experience sensitive to run credibly as a sidecar acquisition from public facts alone.",
      quitDayJobView:
        "Only moderate because the earnings are real, but the category is less durable and less thesis-aligned than the practical service businesses already tracked.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark keeps the first-deal thesis grounded in a more durable and transferable service model.",
      confidence:
        "Confidence is moderate on the public numbers and weak on long-term durability because the business is new and category-specific detail is thin.",
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
