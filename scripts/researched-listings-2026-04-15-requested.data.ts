import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const RESEARCHED_LISTING_BATCH_DATE = "2026-04-15";
export const RESEARCHED_LISTING_NOTE_HEADING = `Backfill analysis (${RESEARCHED_LISTING_BATCH_DATE})`;
export const RESEARCHED_LISTING_VERIFIED_AT = new Date(
  "2026-04-15T18:45:00-04:00",
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
      "Established/Commercial Landscaping /Hardscaping Business - Central OH",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-commercial-landscaping-hardscaping-business-central-oh/2423864/",
    category: "outdoor services",
    subcategory: "commercial landscaping and hardscaping",
    location: "Central Ohio, OH",
    stateCode: "OH",
    askingPrice: 1350000,
    revenue: 2800000,
    sde: 403000,
    ebitda: null,
    employees: 40,
    summary:
      "Central Ohio commercial landscaping and hardscaping company in sale-pending status with 40 employees, heavy equipment included, and a 90 percent commercial revenue base.",
    whyItMayFit:
      "The crew depth and commercial-repeat angle are attractive, especially for a brother-operator model, and the listing is one of the few in the batch that clearly shows real labor depth.",
    risks:
      "The page is already under contract, capex intensity is high, and snow plus holiday-light work can create a much more seasonal and labor-heavy ownership experience than the service-business thesis prefers.",
    brokerName: "Matt Valantine",
    brokerFirm: "Valantine",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.LETTER_OF_INTENT,
    notes:
      "Observed: the live page is marked Sale Pending and the description says Under Contract, ask 1350000, revenue 2800000, SDE 403000, Ohio relocatable with a Central Ohio title, 40 employees listed with count peaks to 60 during the year, 400000 of FF&E included, real estate owned but not included with a stated 900000 value, 90 percent commercial revenue, no state landscaping license requirement, and services spanning maintenance, hardscaping, snow removal, and holiday lights. Inference: this is a real operating company with a serious bench, but it is also a much more labor-heavy and equipment-heavy outdoor-services business than the quieter boring-business thesis sweet spot. Missing: how much revenue is contractual maintenance versus one-time project work, whether there is a true operations layer below the owner, winter margin stability, and customer concentration inside the commercial book. Top 3 follow-up questions: 1) What percentage of gross profit comes from recurring maintenance versus hardscape projects, snow, and holiday lighting? 2) Who runs crews, bids, and customer communication when the owner is away? 3) What does normalized annual maintenance capex look like across trucks, mowers, loaders, and snow equipment?",
    tags: [
      "landscaping",
      "commercial",
      "pending",
      "crew-based",
      "capital-heavy",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 5,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 3,
      capexRisk: 5,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The bench is much deeper here, but the pending status, equipment load, and seasonal labor profile keep it behind the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The base loan math is manageable, but real buyer cash will hinge on equipment replacement reserves, seasonal working capital, and whether the real estate must eventually be secured separately.",
    },
    analysis: {
      thesisFit:
        "Good brother-operator candidate on structure, but not a low-chaos fit.",
      mainReasons:
        "A true crew bench and commercial revenue make this more transferable than most smaller service listings.",
      failureModes:
        "Seasonality, capex, and missing management-layer detail could all make the operation much heavier than the headline SDE suggests.",
      keepDayJobView:
        "Better than most because the team is large, though snow and seasonal crew issues still create real ownership pull.",
      quitDayJobView:
        "Also reasonable because the company is big enough to matter if the under-contract status ever reopens.",
      benchmarkComparison:
        "It stays behind the benchmark because it is far more asset-heavy and much less elegant operationally.",
      confidence:
        "Confidence is good on the public facts and still limited on contract mix and management depth.",
    },
  },
  {
    businessName:
      "Great South Charlotte pool company with high end clientele",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/great-south-charlotte-pool-company-with-high-end-clientele/2011181/",
    category: "home services",
    subcategory: "residential pool service and repair",
    location: "Charlotte, NC",
    stateCode: "NC",
    askingPrice: 1500000,
    revenue: 1002153,
    sde: 225000,
    ebitda: 250000,
    employees: 7,
    summary:
      "Charlotte pool service and repair company with seven employees, dense recurring routes near Quail Hollow, and a repair-heavy service mix backed by transferable manufacturer purchasing terms.",
    whyItMayFit:
      "The route density, Charlotte geography, and in-house repair bench make it more interesting than a basic weekly-pool route business.",
    risks:
      "This is still a discretionary service line, the page reports EBITDA above SDE, and the lease expiration shown publicly is already stale, so diligence needs to start with data cleanup.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1500000, revenue 1002153, SDE 225000, EBITDA 250000, Charlotte NC, established 2007, 7 employees, 50 percent revenue from recurring maintenance routes / 30 percent repairs and upgrades / 20 percent renovations, about 200 recurring weekly clients, seller financing available on a partial basis, 60 days of training plus ongoing consulting support, and a lease-expiration field that still shows 01/01/2023 even though the listing is live. Inference: the route density and repair capability are appealing, but the public economics and stale lease field make this look less clean than the stronger recurring-contract ads in the batch. Missing: whether a foreman or service lead exists below the owner, how much of sales and complex repair quoting still sits with the seller, normalized owner-replacement cash flow given EBITDA above SDE, and true customer-retention stats beyond the recurring-route count. Top 3 follow-up questions: 1) Why does the public page show EBITDA higher than SDE, and what is true owner-replacement cash flow? 2) Who handles diagnosis, repair quoting, and technician oversight today when the owner is unavailable? 3) What is the actual current lease status for the facility and what assets or rental terms would transfer at close?",
    tags: [
      "pool-service",
      "charlotte",
      "recurring-contracts",
      "seller-financing",
      "owner-shaped",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 3,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller will consider partial financing.",
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 4,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The recurring routes and Charlotte location are attractive, but the category is more discretionary and the public numbers are less clean than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: 50,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The partial seller-carry helps, but buyer cash risk sits more in stale lease terms, fleet upkeep, and whether reported cash flow survives a real owner-replacement adjustment.",
    },
    analysis: {
      thesisFit:
        "Interesting Charlotte add, but not a clean enough public story to treat as top conviction.",
      mainReasons:
        "Dense routes, repair capability, and a seller-carry option keep it relevant.",
      failureModes:
        "Messy earnings presentation, stale facility data, or hidden seller dependence in repairs and training would all erode the thesis quickly.",
      keepDayJobView:
        "Moderate because the recurring routes help, but there is not enough public proof of delegated repair leadership.",
      quitDayJobView:
        "Only moderate because the business is profitable but not obviously robust enough after debt and owner replacement to be a slam-dunk household engine.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is more boring, cleaner, and easier to trust from the public page.",
      confidence:
        "Confidence is medium at best because the current page itself exposes an earnings inconsistency and a stale lease field.",
    },
  },
  {
    businessName:
      "Established Air Duct Cleaning & Indoor Air Quality Business",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-air-duct-cleaning-and-indoor-air-quality-business/2471245/",
    category: "home services",
    subcategory: "air duct cleaning and indoor air quality",
    location: "Snohomish County, WA",
    stateCode: "WA",
    askingPrice: 299000,
    revenue: 609994,
    sde: 232456,
    ebitda: null,
    employees: 5,
    summary:
      "Snohomish County air duct and indoor-air-quality business with five full-time employees, repeat residential-light commercial demand, and a broad menu of adjacent crawl-space and insulation services.",
    whyItMayFit:
      "The low ask, real employee count, and benchmark-adjacent service lane make this a practical researched add even though it is outside the preferred geography.",
    risks:
      "Recurring contracts are not actually disclosed, and the broader service menu can still hide seller-led estimating or upsell dependence despite the modest price point.",
    brokerName: "Nicole Wright-Neumiller",
    brokerFirm: "Coldwell Banker Commercial Danforth",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 299000, revenue 609994, SDE 232456, Snohomish County WA, established 2017, 5 full-time employees, leased location, repeat residential and light commercial clientele, and services spanning air duct cleaning, dryer vent cleaning, UV-light installation, cleanouts, insulation, duct replacement, vapor barriers, and pest-exclusion work. Inference: this is one of the more practical lower-capital additions because the service lane is understandable, the employee count is real, and the entry price is modest. Missing: actual recurring-contract percentage, whether the owner still leads estimates and sales, how much revenue comes from the adjacent crawl-space-insulation work versus simpler duct jobs, and whether one lead technician quietly carries most of the technical credibility. Top 3 follow-up questions: 1) What share of revenue comes from repeat scheduled work versus one-off cleanout and installation jobs? 2) Which services drive the best gross margin and which ones still require the owner's direct quoting? 3) Who are the key technicians and how sticky are they post-close?",
    tags: [
      "air-duct-cleaning",
      "indoor-air-quality",
      "snohomish-county",
      "low-ask",
      "service-business",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
      transferabilityRating: 3,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 1,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This is cheaper and in a related service lane, but it has less public evidence of recurring contracts, franchise support, or delegated management depth than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The modest price makes this one easier to finance than most of the batch, but buyer cash should still reserve for equipment, technician retention, and any sales-role replacement.",
    },
    analysis: {
      thesisFit:
        "Good lower-capital watchlist addition in a familiar service lane.",
      mainReasons:
        "The entry price, five-person bench, and understandable service menu make this one easier to underwrite than many bigger but murkier ads.",
      failureModes:
        "If the owner still drives sales and higher-value add-on work, the apparent simplicity could be overstated.",
      keepDayJobView:
        "Middle-of-the-road because the job mix looks schedulable, but there is no public proof of a second management layer.",
      quitDayJobView:
        "Also middling because the cash flow is real but still not obviously enough to justify immediate full-time ownership for this thesis.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark has a cleaner public handoff story and stronger support systems.",
      confidence:
        "Confidence is good on the public facts and moderate on true transferability because the recurring base is implied more than quantified.",
    },
  },
  {
    businessName:
      "$2.0 Million Plumbing Contractor, $350K Net; SBA Pre-Approved! (17923)",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/2-0-million-plumbing-contractor-350k-net-sba-pre-approved-17923/2191403/",
    category: "home services",
    subcategory: "plumbing contractor",
    location: "Bloomington, IN",
    stateCode: "IN",
    askingPrice: 1000000,
    revenue: 2000000,
    sde: 330000,
    ebitda: null,
    employees: 10,
    summary:
      "Bloomington plumbing contractor with 10 employees, two licensed plumbers, an office manager, a service manager, and a mix of service-repair, residential, and commercial work.",
    whyItMayFit:
      "This one has more bench depth and back-office structure than a typical small plumbing ad, plus the price and seller-carry language make it actually financeable on paper.",
    risks:
      "The listing leans on a semi-absentee angle, but the company still looks exposed to a small licensed bench and to the usual plumbing-owner estimating and escalation risk.",
    brokerName: "Jason Hullender",
    brokerFirm: "IAG",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1000000, revenue 2000000, SDE 330000, Bloomington IN, established 1992, 10 employees, two licensed plumbers, office manager, service manager, 50 percent service and repair / 25 percent residential / 25 percent commercial revenue mix, leased 3000 square foot site, seller financing available, SBA-term financing negotiable, and a semi-absentee claim in the facilities section. Inference: this is one of the stronger plumbing adds because the listing at least points to a service-manager layer and a fuller org chart, but the two-licensed-plumber fact still suggests transferability could be thinner than the marketing tone implies. Missing: whether one of the licensed plumbers is the owner, how much commercial work requires deeper owner estimating, whether after-hours calls are meaningful, and whether the service manager truly runs dispatch and quoting today. Top 3 follow-up questions: 1) Which individuals hold the key plumbing licenses and what is the exact post-close continuity plan? 2) How much of weekly sales, estimates, and field escalations still route through the owner? 3) What is the gross-profit split between repair-service work and the non-service residential-commercial jobs?",
    tags: [
      "plumbing",
      "bloomington",
      "seller-financing",
      "service-manager",
      "absentee-claim",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller financing is available and standard SBA-term financing is negotiable for qualified buyers.",
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 3,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The earnings and back-office structure are stronger here, but the plumbing-license chain and lower recurring base keep it behind the cleaner benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The seller-carry plus SBA language make the capital stack more believable than average, but licensed-plumber retention and working trucks remain the key buyer-cash swing factors.",
    },
    analysis: {
      thesisFit:
        "Strong practical plumbing add, but only if the licensed bench is deeper than the public summary makes it sound.",
      mainReasons:
        "A real service manager, office manager, and sensible price point make it more financeable and more transferable than most small trade listings.",
      failureModes:
        "If the owner or one licensed plumber is the real operating hub, the semi-absentee story will fall apart quickly.",
      keepDayJobView:
        "Decent because the listing names a management layer, though plumbing still creates enough field noise to stay cautious.",
      quitDayJobView:
        "Good because the economics are large enough to support a household if the management story is real.",
      benchmarkComparison:
        "It remains behind the benchmark because the recurring revenue and low-chaos ownership shape are weaker here.",
      confidence:
        "Confidence is reasonably good on the public facts and only moderate on how independent the business is from the seller and the licensed plumbers.",
    },
  },
  {
    businessName: "Profitable Plumbing & HVAC Business – Hampton Roads",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/profitable-plumbing-and-hvac-business-hampton-roads/2437183/",
    category: "home services",
    subcategory: "multi-trade hvac plumbing remodeling",
    location: "Hampton Roads, VA",
    stateCode: "VA",
    askingPrice: 2500000,
    revenue: 2970269,
    sde: 684043,
    ebitda: null,
    employees: null,
    summary:
      "Hampton Roads plumbing and HVAC company with nearly $3.0M of revenue, strong public cash flow, and residential-light commercial service positioning, but almost no disclosed team detail.",
    whyItMayFit:
      "The service mix is thesis-relevant, the region is strategically useful, and the earnings are large enough to matter if the company really has a durable licensed team behind it.",
    risks:
      "The listing withholds headcount, org-chart depth, and maintenance-contract details, so the public economics may be real while the transferability story is still too opaque.",
    brokerName: "Joe Moorman, CFC, MBA, CM&AP, CEPA®",
    brokerFirm: "Transworld Business Advisors - RVA",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 2500000, revenue 2970269, SDE 684043, Virginia location with a Hampton Roads title, established year not disclosed, 2 weeks of support, about 207286 of inventory and 195528 of FF&E included, and marketing language around a trusted plumbing-heating-air business with a knowledgeable licensed team, repeat clientele, emergency repair, and possible expansion into remodeling, energy upgrades, and preventive maintenance contracts. Inference: this is financially meaningful enough to track, but the page does not actually prove the operator bench, maintenance base, or seller independence needed for a practical transferability call. Missing: employee count, management structure, exact recurring-maintenance percentage, whether plumbing-remodeling work pulls the owner into estimating or project management, and how much emergency burden the licensed team absorbs today. Top 3 follow-up questions: 1) What is the current org chart and who handles dispatch, estimating, and major service escalations? 2) What percentage of revenue and gross profit comes from recurring maintenance versus one-off repairs, installs, and remodeling work? 3) How often does after-hours emergency work hit ownership instead of the field team?",
    tags: [
      "hvac",
      "plumbing",
      "hampton-roads",
      "maintenance-agreements",
      "under-disclosed",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 3,
      transferabilityRating: 3,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 4,
      dataConfidenceScore: 3,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The economics are much bigger here, but the public operating picture is far less clean and probably much noisier day to day.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The leverage model can work against the disclosed SDE, but the missing org-chart detail means buyer cash may need to cover management or licensed-operator reinforcement early.",
    },
    analysis: {
      thesisFit:
        "Strong on paper and worth tracking, but still under-disclosed relative to the price and complexity.",
      mainReasons:
        "Essential services, meaningful cash flow, and a strategically relevant region keep it on the serious board.",
      failureModes:
        "Missing team detail, emergency burden, and hidden owner-estimating dependence could all turn this into a much messier operating company than the ad suggests.",
      keepDayJobView:
        "Weak because a multi-trade service business with emergency work is not a believable sidecar without proven management depth.",
      quitDayJobView:
        "Good enough to matter if the public SDE is clean and the licensed team truly carries the operation.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is much easier to underwrite and much less complex operationally.",
      confidence:
        "Confidence is moderate on the headline numbers and intentionally limited on transferability until the org chart and maintenance mix are disclosed.",
    },
  },
  {
    businessName:
      "Highly Profitable, Established HVAC Service Provider with Real Estate",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/highly-profitable-established-hvac-service-provider-with-real-estate/2447647/",
    category: "home services",
    subcategory: "hvac services",
    location: "Morris County, NJ",
    stateCode: "NJ",
    askingPrice: 2200000,
    revenue: 4000000,
    sde: 318988,
    ebitda: 318988,
    employees: 17,
    summary:
      "Morris County HVAC service provider with 17 disclosed employees, included commercial real estate, 600-plus preventative-maintenance contracts, and some seller-financing flexibility.",
    whyItMayFit:
      "This listing has more public team depth and recurring-contract support than most HVAC ads, and the included real estate plus seller-financing language make it a serious trackable platform.",
    risks:
      "The ad also describes a 22-person team and 17 vehicles, so the staffing story is not perfectly clean, and 24/7 emergency service plus a rich multiple could still leave this less comfortable than it first appears.",
    brokerName: "Jon Sheklow",
    brokerFirm: "Number1BusinessBroker.com",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 2200000, revenue 4000000, SDE and EBITDA 318988, Morris County NJ, established 1986, real estate included with a stated 600000 value, more than 600 active preventative-maintenance contracts, seller-financing language for well-qualified buyers, and public language that calls the business non-owner dependent with a skilled 22-person team and 17 service vehicles while the detailed employee field lists 17 full-time employees. Inference: this is one of the better public team-depth HVAC listings in the batch, but the low cash flow relative to revenue and the inconsistent staffing language mean the quality-of-earnings and delegation story still need real diligence. Missing: whether the 17-versus-22 headcount gap is staff versus contractors, how much profit is being suppressed by payroll or owner replacement, who handles nights and emergency dispatch, and whether the owner truly has already stepped out of key client and estimating work. Top 3 follow-up questions: 1) What is the actual org chart today, including management, service leads, office roles, and owner duties? 2) How much of gross profit comes from recurring maintenance versus replacements, emergency calls, and project work? 3) What explains the low SDE margin on $4.0M of revenue and the employee-count discrepancy in the listing?",
    tags: [
      "hvac",
      "new-jersey",
      "recurring-contracts",
      "real-estate-included",
      "large-team",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says some seller financing may be considered for well-qualified buyers.",
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 4,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This has far more team depth and recurring maintenance, but the valuation and 24/7 operating burden still make it a less comfortable first-owner fit than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The included real estate and possible seller carry help, but the real issue is whether the low public SDE already reflects a durable management layer or still needs more owner-replacement cost.",
    },
    analysis: {
      thesisFit:
        "Serious HVAC platform candidate, but not obviously cheap or low-chaos.",
      mainReasons:
        "Large team, contract base, real estate, and seller-carry language make it much more substantial than a typical one-owner HVAC ad.",
      failureModes:
        "Emergency-service burden, weak quality of earnings, or the staffing inconsistency masking a thinner real bench could all break the transferability case.",
      keepDayJobView:
        "Only moderate because team depth helps, but 24/7 HVAC service is still too noisy to trust casually.",
      quitDayJobView:
        "Reasonable if the public non-owner-dependent claim is true and the low margin has a clean explanation.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is cheaper, simpler, and easier to underwrite despite being smaller.",
      confidence:
        "Confidence is moderate because the listing discloses a lot, but it also leaves meaningful questions around margin quality and true team depth.",
    },
  },
  {
    businessName:
      "Established Commercial HVAC and Refrigeration Service Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-commercial-hvac-and-refrigeration-service-company/2480906/",
    category: "construction services",
    subcategory: "commercial hvac and refrigeration",
    location: "Southeast Michigan, MI",
    stateCode: "MI",
    askingPrice: 1900000,
    revenue: 1462247,
    sde: 608680,
    ebitda: null,
    employees: 3,
    summary:
      "Southeast Michigan commercial HVAC and refrigeration service company with roughly three people including the owner, recurring maintenance work, and a home-based operating footprint.",
    whyItMayFit:
      "The category is durable, the cash flow is real, and Southeast Michigan still fits the family-market thesis better than many other commercial-service listings.",
    risks:
      "The company looks very owner-shaped because the detailed page describes only two full-time employees plus the owner, so transferability, credential coverage, and emergency burden all need hard verification.",
    brokerName: "Haroon Bhatti",
    brokerFirm: "Capital Business Brokerage",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1900000, revenue 1462247, SDE 608680, Michigan location with business-description language saying it operates primarily in Southeast Michigan, established 1978, commercial and institutional customers, recurring maintenance agreements, home-based operations, and a detailed-info section that lists 2 full-time employees while also saying there are 3 employees including the owner. Inference: the service lane and cash flow are attractive, but this still reads more like a seller-centered technical shop than a delegated commercial maintenance platform. Missing: who holds the critical mechanical or refrigeration credentials, how much of dispatch-estimating-client relationships still sit with the owner, whether after-hours refrigeration service is routine, and whether the two non-owner technicians are enough bench depth for a stable handoff. Top 3 follow-up questions: 1) Which licenses, certifications, and customer relationships are tied directly to the seller today? 2) How much of revenue comes from contract maintenance versus reactive commercial repair and emergency work? 3) If the owner stepped out for two weeks, who would handle quoting, dispatch, and major customer escalations?",
    tags: [
      "commercial-hvac",
      "refrigeration",
      "southeast-michigan",
      "home-based",
      "owner-shaped",
    ],
    legacyRatings: {
      ownerDependenceRating: 5,
      recurringRevenueRating: 4,
      transferabilityRating: 2,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: false,
      sellerFinancingNotes: "Listing explicitly says no seller financing.",
      operatorSkillDependency: 5,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The commercial-service category and cash flow are stronger here, but the tiny bench and obvious owner-shape keep it behind the cleaner benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The headline SBA math is workable, but buyer cash can widen quickly if a replacement licensed operator, additional tech, or more service-van depth is needed right after close.",
    },
    analysis: {
      thesisFit:
        "Worth tracking for category and geography, but clearly not a clean delegation story yet.",
      mainReasons:
        "Commercial recurring service and meaningful SDE keep it economically relevant.",
      failureModes:
        "A very small bench, seller-held know-how, and refrigeration after-hours issues could make this much harder to own than the headline numbers imply.",
      keepDayJobView:
        "Poor because a three-person commercial trade business does not look like a believable sidecar asset.",
      quitDayJobView:
        "Reasonable only if the owner role can truly be replaced without losing key accounts or technical coverage.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is simpler, less credential-heavy, and less exposed to one small team.",
      confidence:
        "Confidence is decent on the public facts and intentionally skeptical on transferability because the staffing disclosure is so thin.",
    },
  },
  {
    businessName:
      "Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/premier-nj-residential-pool-service-co-37-yrs-recurring-contracts/2492839/",
    category: "home services",
    subcategory: "residential pool service and repair",
    location: "Morris County, NJ",
    stateCode: "NJ",
    askingPrice: 1600000,
    revenue: 1628215,
    sde: 438569,
    ebitda: null,
    employees: 11,
    summary:
      "Morris County residential pool service company with 11 full-time employees, annual service agreements for every customer, and an assistant service manager who can absorb day-to-day operations.",
    whyItMayFit:
      "The recurring-contract base, long customer tenure, and explicit second-layer operational coverage make this one of the more transferable service businesses in the requested set.",
    risks:
      "Pool care is still seasonal and more discretionary than HVAC or plumbing, so the affluent-customer profile and the pool-service category keep it a little less durable than the ideal boring-needs-based target.",
    brokerName: "Angelo A. Ferrara",
    brokerFirm: "Rapt Business Brokers",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1600000, revenue 1628215, SDE 438569, Morris County NJ, established 1989, 11 full-time employees, 11-vehicle fleet, annual service agreements for every customer, about 325 openings and closings per year, no customer above 5 percent, and a listing claim that the assistant service manager with 11 years of tenure can take over scheduling, estimates, repairs, customer communication, and technician oversight. Inference: this is one of the cleaner delegation stories in the batch because the listing points to recurring contracts plus a real operations handoff path rather than a pure seller-tech story. Missing: actual seasonality by month, gross-margin split between recurring service versus repairs or renovations, whether the assistant manager is truly staying, and how much the owner still anchors sales or affluent-client relationships. Top 3 follow-up questions: 1) What percentage of gross profit comes from weekly contract work versus repairs, renovations, and opening-closing revenue? 2) Is the assistant service manager staying post-close under signed retention terms? 3) How much owner involvement still sits inside top-customer relationships, route design, and technician recruiting?",
    tags: [
      "pool-service",
      "new-jersey",
      "recurring-contracts",
      "manager-run",
      "large-team",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 5,
      transferabilityRating: 4,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The recurring contracts and management bench are excellent, but the pool-service category is more seasonal and less needs-based than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 2,
      cashToCloseNotes:
        "The cash-to-close math looks workable with SBA support, but the real swing factors are peak-season working capital, fleet upkeep, and retention of the assistant service manager plus technicians.",
    },
    analysis: {
      thesisFit:
        "Strong manager-transferability candidate even though it sits outside the pure essential-service lane.",
      mainReasons:
        "Annual contracts, a real team, and a named second layer make it more believable than most owner-led pool ads.",
      failureModes:
        "Seasonality, affluent-customer churn, or the assistant manager not really being a durable second-in-command could weaken the story fast.",
      keepDayJobView:
        "Good because the recurring route model and assistant-manager coverage make delegated ownership more plausible than usual.",
      quitDayJobView:
        "Also good because the earnings are large enough to matter without needing heroic upside assumptions.",
      benchmarkComparison:
        "It stays just behind the benchmark because the benchmark is a more boring needs-based service, even though this has stronger public delegation signals.",
      confidence:
        "Confidence is fairly high on the public facts and still incomplete on true manager retention and seasonal cash conversion.",
    },
  },
  {
    businessName: "Commercial HVAC Filter Change-Out & Maintenance",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/commercial-hvac-filter-change-out-and-maintenance/2477541/",
    category: "facility services",
    subcategory: "commercial hvac filter maintenance",
    location: "Olathe, KS",
    stateCode: "KS",
    askingPrice: 675000,
    revenue: 355184,
    sde: 258708,
    ebitda: null,
    employees: 1,
    summary:
      "Olathe home-based commercial HVAC filter-maintenance business with one part-time employee, three seasonal helpers, and recurring scheduled service work across the Kansas City area.",
    whyItMayFit:
      "This is a genuinely boring B2B maintenance lane with no specialized licensing and predictable schedules, which makes it interesting even though it is small.",
    risks:
      "The bench is tiny, the 90%+ margin language is promotional, and the business may be more of a good owner job than a durable stand-alone company.",
    brokerName: "Mark Schmitz",
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: ask 675000, revenue 355184, SDE 258708, Olathe KS, established 1996, one part-time employee plus three seasonal summer employees, home-based operations, recurring monthly-bi-monthly-quarterly commercial HVAC filter services, no specialized licensing, and a service model marketed as flexible with minimal time constraints. Inference: the service is exactly the kind of boring recurring commercial maintenance work worth tracking, but the company is so small that it may still behave more like an owner-operated route than a transferable business. Missing: customer concentration, route density, how much labor the owner personally performs, whether the part-time employee is critical, and how sticky the commercial accounts really are. Top 3 follow-up questions: 1) What percentage of route work and customer communication still sits with the owner personally? 2) How concentrated is revenue across the top 10 contracts and how long are those agreements? 3) Could a buyer realistically install a lead tech or route manager without destroying the economics?",
    tags: [
      "commercial-hvac",
      "b2b",
      "home-based",
      "recurring-contracts",
      "small-team",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 5,
      transferabilityRating: 3,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 1,
      afterHoursBurden: 1,
      capexRisk: 1,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.bridge_while_employed,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This one is simpler and more recurring on paper, but the bench is much thinner and the scale is too small to beat the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The business does not need much capex, but the real question is whether the buyer is purchasing a transferable contract base or just buying the seller's personal route economics.",
    },
    analysis: {
      thesisFit:
        "Trackable because the service is boring and recurring, but it is still very thin.",
      mainReasons:
        "No licensing, low capex, and recurring commercial schedules make the operating model attractive in theory.",
      failureModes:
        "A tiny bench and hidden owner labor could mean this is not really delegable at all.",
      keepDayJobView:
        "Better than most tiny trade listings because the work is scheduled and low-chaos, though there is still almost no team depth.",
      quitDayJobView:
        "Weak because the scale looks too small for a realistic family-supporting post-close setup.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is much more proven as a real small company instead of a tidy owner route.",
      confidence:
        "Confidence is solid on the public facts and cautious on transferability because the bench is so small.",
    },
  },
  {
    businessName: "Lucrative, Pool Service Business with 4.9 Stars!",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/lucrative-pool-service-business-with-4-9-stars/2412159/",
    category: "home services",
    subcategory: "pool service and repair franchise",
    location: "Kernersville, NC",
    stateCode: "NC",
    askingPrice: 760000,
    revenue: 1073579,
    sde: 232237,
    ebitda: null,
    employees: null,
    summary:
      "Kernersville Pool Scouts franchise with more than $1.0M in revenue, a stated general manager plus experienced staff, strong online reviews, and recurring weekly-biweekly service contracts.",
    whyItMayFit:
      "This is one of the cleaner smaller bridge-style additions because the page explicitly mentions a general manager, concentrated territories, and recurring routes within a systemized franchise model.",
    risks:
      "The business is young, franchise economics matter, staffing detail is incomplete, and the listing itself says it launched in 2022 while the header shows an established date of 2021.",
    brokerName: null,
    brokerFirm: "Buyer Services",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 760000, revenue 1073579, SDE 232237, Kernersville NC, established 2021 in the header while the description says launched in 2022, recurring weekly and bi-weekly service contracts, additional openings-closings-repairs revenue, a strong general manager and experienced staff in place, more than 180 Google reviews at 4.9 stars, Pool Scouts franchise training support, and no public employee count. Inference: this is a plausible smaller bridge-style candidate because the listing describes actual system support and a manager layer, but it is still a recently built franchise in a seasonal category rather than a long-proven boring service company. Missing: exact employee count, franchise royalty and marketing burden, whether the general manager is staying under contract, and how much margin comes from recurring maintenance versus bursty repair and seasonal work. Top 3 follow-up questions: 1) What is the full staffing chart today, and is the general manager committed post-close? 2) What are the all-in royalty, marketing-fund, and territory economics after local payroll and debt service? 3) How much of current growth depends on local owner energy versus repeat route density and franchisor systems?",
    tags: [
      "pool-service",
      "franchise",
      "manager-in-place",
      "recently-founded",
      "route-based",
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
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 1,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 4,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The manager mention is encouraging here, but the younger age, franchise exposure, and pool-service category keep it behind the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 2,
      cashToCloseNotes:
        "The purchase price is manageable, but the real underwriting work sits in franchise fees, territory protection, and whether the public general-manager story is durable after close.",
    },
    analysis: {
      thesisFit:
        "Good smaller bridge-style add, but not a first-choice essential-service target.",
      mainReasons:
        "A named manager layer, recurring routes, and a modest capital requirement make it more workable than many recent franchise resales.",
      failureModes:
        "If the growth is still owner-pushed or the general manager is not sticky, the transferability case weakens fast.",
      keepDayJobView:
        "Good because the listing at least points to manager coverage and route density.",
      quitDayJobView:
        "Only moderate because the business is still relatively young and the post-debt economics are not obviously wide.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is older, more boring, and in a more durable service lane.",
      confidence:
        "Confidence is moderate because the page is detailed, but the young operating history and missing staffing count still matter.",
    },
  },
  {
    businessName:
      "Established Organic Lawn Care & Pest Control – Recurring Revenue",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/established-organic-lawn-care-and-pest-control-recurring-revenue/2418469/",
    category: "home services",
    subcategory: "organic lawn care and pest control franchise",
    location: "Houston, TX",
    stateCode: "TX",
    askingPrice: 314000,
    revenue: 628830,
    sde: null,
    ebitda: null,
    employees: 4,
    summary:
      "Houston organic lawn care and pest control franchise with 744 active clients, four full-time staff including an office manager, and an undisclosed cash-flow figure.",
    whyItMayFit:
      "The recurring-customer base, office-manager support, and modest entry price make this a practical listing to keep on the board even though it is clearly still an early-screen deal.",
    risks:
      "The public page does not disclose SDE, the ask-price story conflicts inside the listing, and the franchise plus licensing requirements could make the simple route thesis weaker than it looks.",
    brokerName: "Jason Ward",
    brokerFirm: "TruView Business Advisors",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    notes:
      "Observed: ask 314000 in the header, revenue 628830, SDE and EBITDA undisclosed, Houston TX, established 2007, 744 active clients, four full-time employees including three field technicians plus one office manager, recurring seasonal fertilizer and weed-control programs, add-on fire ant / flea and tick work, and seller-financing language that says case by case while the description separately says asking price 350000 with 50 percent down for seller carry. Inference: the recurring client base and office-manager support are encouraging, but the missing SDE plus the conflicting price narrative mean this should be treated as a cautious track-only listing for now. Missing: actual owner cash flow after royalties and replacement labor, exact licensing or certification requirements, average route density, and how dependent the current owner is for sales, technician management, or franchise compliance. Top 3 follow-up questions: 1) What is true trailing owner-replacement SDE after royalties, marketing fund, and any normalized owner labor? 2) Which pesticide or applicator credentials are required and who currently holds them? 3) Why does the public page show a 314000 header price while the description still references 350000 and a seller-carry structure?",
    tags: [
      "lawn-care",
      "pest-control",
      "houston",
      "franchise",
      "office-manager",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 5,
      transferabilityRating: 3,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller financing is available case by case and separately references a 50% down seller-carry structure.",
      operatorSkillDependency: 2,
      licenseDependency: 3,
      afterHoursBurden: 1,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 2,
      keepDayJobFit: 3,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.bridge_while_employed,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The recurring base is appealing, but hidden cash flow and conflicting price language keep it well behind the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The low headline price helps, but the missing SDE and conflicting seller-carry language mean the real cash-to-close picture is impossible to trust yet.",
    },
    analysis: {
      thesisFit:
        "Trackable recurring-service add, but clearly still a low-confidence screen.",
      mainReasons:
        "744 active clients and an office manager are the right structural signals for a small recurring route business.",
      failureModes:
        "Missing cash flow, licensing friction, or franchise drag could make the economics much weaker than the recurring-revenue story suggests.",
      keepDayJobView:
        "Somewhat plausible because the route model and office support help, though the unknown economics still limit conviction.",
      quitDayJobView:
        "Weak because there is no disclosed SDE to prove this can support a household after debt and owner replacement.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark has visible cash flow and a much cleaner public operating story.",
      confidence:
        "Confidence is intentionally low because the page withholds core earnings and conflicts on price.",
    },
  },
  {
    businessName: "Well Established HVAC Company Serving Southern Maryland",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/well-established-hvac-company-serving-southern-maryland/2306504/",
    category: "home services",
    subcategory: "multi-trade hvac plumbing remodeling",
    location: "Southern Maryland, MD",
    stateCode: "MD",
    askingPrice: 750000,
    revenue: 1377149,
    sde: 173029,
    ebitda: null,
    employees: 9,
    summary:
      "Southern Maryland home-based HVAC, plumbing, and remodeling company with nine employees, 2,500 active customers, and 110 maintenance agreements.",
    whyItMayFit:
      "The customer count and maintenance-agreement base make it more substantial than the headline SDE alone suggests, so it is still worth tracking in a Maryland-adjacent market.",
    risks:
      "The cash flow is thin relative to the complexity, the company is home-based, and the mixed plumbing-remodeling-HVAC profile can still hide a lot of owner coordination work.",
    brokerName: "Patrick Lange",
    brokerFirm: "Business Modification Group",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 750000, revenue 1377149, SDE 173029, Maryland location with a Southern Maryland title, established 2008, 9 employees, home-based operations, 2500 active customers, 110 active maintenance agreements, 90 percent residential / 10 percent commercial, and a service mix split between HVAC at 55 percent and plumbing-remodeling at 45 percent. Inference: the customer base is meaningful, but the company may still be too operationally broad and too thin on owner cash flow to fit the preferred realistic-family-support thesis cleanly. Missing: how many of the nine employees are field techs versus office-admin roles, which licenses or permits are key, how much remodeling creates project-management chaos, and what normalized owner-replacement cash flow looks like after debt and benefits. Top 3 follow-up questions: 1) What is the current staffing split across HVAC techs, plumbers, remodel labor, and office support? 2) How much of the owner's week is still spent scheduling, quoting, and solving jobsite issues? 3) What percentage of gross profit comes from recurring HVAC maintenance versus lower-frequency plumbing or remodeling jobs?",
    tags: [
      "hvac",
      "maryland",
      "home-based",
      "maintenance-agreements",
      "multi-trade",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 3,
      transferabilityRating: 3,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 1,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The customer base is larger here, but the thinner cash flow and multi-trade complexity make it a weaker practical fit than the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The entry price is manageable, but the more important question is whether the low public SDE already assumes the owner is replaced; if not, post-close cash could get tight quickly.",
    },
    analysis: {
      thesisFit:
        "Worth keeping in the tracker for the customer base, but not a clean buy thesis from public facts alone.",
      mainReasons:
        "A real customer count and maintenance base make it more serious than a tiny trade shop.",
      failureModes:
        "Mixed-service complexity, home-based operations, and too little normalized cash after debt could all make this a frustrating owner job.",
      keepDayJobView:
        "Poor because a home-based multi-trade service company with nine employees is not a believable sidecar without a stronger public management story.",
      quitDayJobView:
        "Weak because the public SDE is too thin relative to the complexity and likely owner replacement cost.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is much simpler and cleaner for a first acquisition.",
      confidence:
        "Confidence is decent on the disclosed facts and still limited on whether the economics are truly buyer-friendly after transition.",
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
