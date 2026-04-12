import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const HIGH_VALUE_LISTING_BATCH_DATE = "2026-04-11";
export const HIGH_VALUE_LISTING_NOTE_HEADING = `Backfill analysis (${HIGH_VALUE_LISTING_BATCH_DATE})`;
export const HIGH_VALUE_LISTING_VERIFIED_AT = new Date(
  "2026-04-11T12:00:00-04:00",
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

type HighValueListingSeedInput = {
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
    HIGH_VALUE_LISTING_NOTE_HEADING,
    `- Thesis fit: ${analysis.thesisFit}`,
    `- Main reasons it may work: ${analysis.mainReasons}`,
    `- Main failure modes: ${analysis.failureModes}`,
    `- Keep-day-job view: ${analysis.keepDayJobView}`,
    `- Quit-day-job view: ${analysis.quitDayJobView}`,
    `- Benchmark comparison: ${analysis.benchmarkComparison}`,
    `- Confidence / missing diligence: ${analysis.confidence}`,
  ].join("\n");
}

function buildManagedBusinessData(seed: HighValueListingSeedInput) {
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

export const highValueListingSeeds = [
  {
    businessName: "High Income Recession-Proof HVAC Services Business",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/high-income-recession-proof-hvac-services-business/2449811/",
    category: "home services",
    subcategory: "hvac services",
    location: "Tyler, TX",
    stateCode: "TX",
    askingPrice: 1300000,
    revenue: 2647388,
    sde: 571000,
    ebitda: null,
    employees: 9,
    summary:
      "Tyler HVAC service company with nine employees, eight vehicles, a 4,200 square foot leased shop-office, franchise systems, and a disclosed maintenance-contract component.",
    whyItMayFit:
      "This is the strongest current non-plumbing quit-the-job candidate in the batch because the earnings are real, the team is already built, and the listing at least gestures toward a more delegated operating model.",
    risks:
      "Franchise economics, technical bench depth, lease rollover risk, and the possibility that the owner is still central to sales or field escalation all matter here.",
    brokerName: "Michael Simon",
    brokerFirm: "Fortune Business Brokers",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1300000, revenue 2647388, SDE 571000, 9 employees, Tyler TX, recurring maintenance-contract component, franchise systems, 8 vehicles, 4200 square foot leased shop-office, and a listing claim that this can run with executive management. Inference: this is the best current non-plumbing quit-job candidate in the set, but the owner-removal story should be treated as a claim until the org chart and dispatch-sales flow are proven. Missing: franchise royalty burden, service-agreement mix, lease term, who holds licenses, and whether the owner is truly out of day-to-day selling and technical oversight.",
    tags: [
      "hvac",
      "tyler",
      "franchise",
      "maintenance-contracts",
      "quit-job-candidate",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 4,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
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
      keepDayJobFit: 2,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. This clearly beats the benchmark for the quit-day-job lane on earnings and team depth, even though it is harder technically and less simple to own.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Franchise transfer costs, lease assumptions, and fleet reserve needs can make the real close-cash requirement land above the simple 14% to 20% range.",
    },
    analysis: {
      thesisFit:
        "Best current non-plumbing quit-day-job candidate, but not a clean bridge play.",
      mainReasons:
        "Real earnings, a built team, vehicles, and some recurring maintenance give it genuine operating-company shape.",
      failureModes:
        "Franchise drag, weak management depth, and hidden owner dependence could collapse the delegated-ownership story quickly.",
      keepDayJobView:
        "Weak to middling unless there is a real second layer below the owner because HVAC field and sales issues can pull ownership back in fast.",
      quitDayJobView:
        "Strong if the maintenance base and team depth are real because the earnings are already large enough to replace salary with room to spare.",
      benchmarkComparison:
        "This beats the current Fairfax HVAC benchmark for income replacement, but it does so by adding more technical complexity and capital intensity.",
      confidence:
        "Confidence is solid on the headline numbers, but the executive-management claim is still inference until diligence proves the owner is truly removed.",
    },
  },
  {
    businessName: "Plumbing and Heating Service",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/plumbing-and-heating-service/2491355/",
    category: "home services",
    subcategory: "plumbing and heating service",
    location: "Colorado",
    stateCode: "CO",
    askingPrice: null,
    revenue: 2130000,
    sde: 490000,
    ebitda: 490000,
    employees: null,
    summary:
      "Colorado plumbing and heating company serving residential and light commercial customers, with repeat and referral-heavy demand, little to no new-construction exposure, and owned real estate mentioned in the listing.",
    whyItMayFit:
      "This is the best Colorado upside candidate on paper because the category fits the thesis, the earnings are meaningful, and the listing at least hints at an experienced employee base instead of a solo owner-trade shop.",
    risks:
      "The hidden price, hidden org chart, hidden owner role, and unclear licensing setup make it easy to read too much into a thin listing.",
    brokerName: "Don Beezley",
    brokerFirm: "ProformaPartners, LLC",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: asking price undisclosed, revenue 2130000, SDE and EBITDA 490000, Colorado location, residential and light commercial mix, repeat and referral-heavy demand, little to no new construction, experienced employee base, and owned real estate mentioned. Inference: this may be the best Colorado upside candidate in the set, but the public page withholds the exact facts needed to underwrite transferability. Missing: purchase price allocation, employee count, who runs dispatch-estimating now, whether real estate is included, and how the plumbing-heating license chain actually transfers.",
    tags: [
      "plumbing",
      "heating",
      "colorado",
      "under-disclosed",
      "repeat-business",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 3,
      transferabilityRating: 3,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 2,
      regretIfWrongScore: 3,
      dataConfidenceScore: 2,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Colorado location and category fit are attractive, but hidden price and transferability facts keep it from beating the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Without a disclosed ask, the modeled cash-to-close range is not the binding issue yet; the bigger problem is that the financing story is still incomplete.",
    },
    analysis: {
      thesisFit:
        "Strong category fit, but conviction is capped by missing public detail.",
      mainReasons:
        "Essential residential and light commercial plumbing-heating work with repeat demand is exactly the kind of real-world service lane worth tracking.",
      failureModes:
        "If the seller is still the estimator, license holder, or lead relationship owner, the nice headline cash flow will be less transferable than it looks.",
      keepDayJobView:
        "Weak because plumbing-heating businesses usually need a committed operator unless the bench is already deep and dispatch is truly stable.",
      quitDayJobView:
        "Good enough to matter if the hidden price and owner-role facts come back clean, because the earnings base is real.",
      benchmarkComparison:
        "This stays behind the benchmark for now because the benchmark discloses enough to underwrite a cleaner ownership transfer story.",
      confidence:
        "Confidence is intentionally low because the listing withholds too many core underwriting details.",
    },
  },
  {
    businessName: "Plumbing and Heating with Nearly $400,000 Cash Flow",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/plumbing-and-heating-with-nearly-400-000-cash-flow/2386132/",
    category: "home services",
    subcategory: "plumbing and heating service",
    location: "Parker, CO",
    stateCode: "CO",
    askingPrice: 880000,
    revenue: 802288,
    sde: 394228,
    ebitda: null,
    employees: null,
    summary:
      "Parker plumbing and heating business with a home-based setup, repeat local customers, little reported seasonality, and a long-tenured office administrator.",
    whyItMayFit:
      "This is the best disclosed Colorado plumbing value play because the price is understandable, the home-based structure is simple, and the listing gives at least a few concrete signals of customer loyalty and administrative continuity.",
    risks:
      "It is still smaller and likely more owner-shaped than the best bigger-service-company targets, and the listing does not really prove who sells or runs the field.",
    brokerName: "Jeff Child",
    brokerFirm: "VR Business Brokers",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 880000, revenue 802288, SDE 394228, Parker CO, home-based operations, many repeat loyal customers, no real seasonality claimed, and an office administrator with 25-plus years in the business. Inference: this looks like the cleanest disclosed Colorado plumbing value play, but it is probably still more owner-shaped than the larger Tyler HVAC candidate. Missing: employee count, exact license-holder setup, how much of the quoting-sales flow still sits with the seller, and whether the office admin or field leads are truly enough to buffer a transition.",
    tags: [
      "plumbing",
      "heating",
      "parker",
      "home-based",
      "value-play",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 3,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Colorado geography and price-to-cash-flow are attractive, but the smaller bench and likely owner-shaped workflow keep it behind the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The modeled equity check looks manageable, but licensing transfer, any working-capital reset, and replacing hidden owner labor still matter more than the simple loan math.",
    },
    analysis: {
      thesisFit:
        "Strong smaller Colorado candidate, though still probably more owner-shaped than ideal.",
      mainReasons:
        "Home-based simplicity, a sensible ask, and repeat-customer language make this easier to underwrite than the more opaque Colorado listings.",
      failureModes:
        "If the seller still owns the quoting and technical decisions, the attractive multiple will not fully translate into a clean handoff.",
      keepDayJobView:
        "Possible but not obvious because a small plumbing-heating company can still drag the owner into sales and field problems quickly.",
      quitDayJobView:
        "Good because the SDE is already meaningful relative to the ask, assuming the labor really transfers.",
      benchmarkComparison:
        "This stays behind the benchmark because it is cheaper and simpler, but it does not look as deep or as transferable.",
      confidence:
        "Confidence is relatively good because the listing discloses usable numbers and a few operating facts, but the labor-ownership split still needs proof.",
    },
  },
  {
    businessName:
      "Sewer/Water Line Repair Co, 1.4M Rev, 607K, Net, SP Only 1.6M, Growing",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/sewer-water-line-repair-co-1-4m-rev-607k-net-sp-only-1-6m-growing/2456675/",
    category: "home services",
    subcategory: "sewer and water line repair",
    location: "Colorado Springs, CO",
    stateCode: "CO",
    askingPrice: 1590000,
    revenue: 1420000,
    sde: 607000,
    ebitda: 607000,
    employees: null,
    summary:
      "Colorado Springs sewer and water line repair business with strong disclosed cash flow, need-driven demand, and a price that is still understandable relative to the earnings.",
    whyItMayFit:
      "This is the best current live Colorado balance of earnings and family-location fit because the category is essential, the cash flow is real, and the deal is still in a buyable size range.",
    risks:
      "Field-execution dependence, foreman-owner concentration, and likely emergency schedule burden make this a tougher business than the headline multiple suggests.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1590000, revenue 1420000, SDE and EBITDA 607000, Colorado Springs location, and growing sewer-water line repair positioning. Inference: this is one of the strongest Colorado income-replacement candidates, but it likely carries more foreman dependence and after-hours burden than a cleaner plumbing-heating shop. Missing: employee count, exact field leadership depth, equipment list, on-call expectations, and whether one estimator-operator is still the real bottleneck.",
    tags: [
      "sewer",
      "water-line",
      "colorado-springs",
      "essential-services",
      "quit-job-candidate",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
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
      afterHoursBurden: 5,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The earnings are stronger, but the likely emergency burden and field-execution dependence make it a rougher fit than the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Excavation gear, working-capital swings, and any hidden emergency-service staffing need could push real close cash toward the top of the modeled range.",
    },
    analysis: {
      thesisFit:
        "Very strong quit-day-job candidate, but weak keep-the-job fit.",
      mainReasons:
        "Need-driven work, good disclosed cash flow, and Colorado Springs geography make it one of the most relevant live deals in the batch.",
      failureModes:
        "If one estimator, foreman, or licensed operator is carrying the real system, the transfer story gets much worse than the simple multiple implies.",
      keepDayJobView:
        "Poor because this kind of line-repair business usually needs a committed operator and can generate urgent field issues.",
      quitDayJobView:
        "Strong if leadership depth is real because the cash flow is already large enough to justify direct ownership.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is a cleaner operating rhythm even though this one has better raw cash generation.",
      confidence:
        "Confidence is moderate because the listing gives usable economics but not enough organizational detail to de-risk transferability.",
    },
  },
  {
    businessName: "Water Well Drilling Company-New lower price",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/water-well-drilling-company-new-lower-price/2341517/",
    category: "industrial services",
    subcategory: "water well drilling",
    location: "Elbert County, CO",
    stateCode: "CO",
    askingPrice: 5500000,
    revenue: 3763436,
    sde: 852928,
    ebitda: null,
    employees: null,
    summary:
      "Elbert County water well drilling company with strong disclosed cash flow, significant real-estate value, and a highly physical-world service profile.",
    whyItMayFit:
      "The economics are real and the category is extremely AI-resistant, so it deserves to stay on the radar even though it sits well outside the simple-service lane.",
    risks:
      "This is heavy, asset-intensive, capex-intensive, and credential-sensitive, so the downside profile is materially harsher than the lighter home-service targets.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 5500000, revenue 3763436, SDE 852928, Elbert County CO, and meaningful real-estate value included in the story. Inference: the cash flow is strong and the work is undeniably real-world, but this is a much heavier operating company than the simpler HVAC-plumbing targets. Missing: equipment age, real-estate split, licensing-credential chain, maintenance capex needs, and whether the driller-estimator bench goes beyond one or two key people.",
    tags: [
      "water-well",
      "drilling",
      "colorado",
      "asset-heavy",
      "capital-intensive",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 1,
      transferabilityRating: 2,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 2,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 1,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 5,
      licenseDependency: 5,
      afterHoursBurden: 3,
      capexRisk: 5,
      regretIfWrongScore: 1,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The work is more defensible physically, but the capital burden and credential dependence make it a much worse fit for the current thesis.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The modeled range is not conservative enough for a drilling company because equipment reserves, real-estate treatment, and lender collateral requirements can all expand the equity need.",
    },
    analysis: {
      thesisFit:
        "Worth tracking, but well outside the simpler first-acquisition lane.",
      mainReasons:
        "The work is essential, AI-resistant, and attached to a real earnings base.",
      failureModes:
        "Heavy equipment, license continuity, and key driller dependence can turn a good-looking deal into a capital sink quickly.",
      keepDayJobView:
        "Poor because there is too much technical and capital oversight required for passive ownership to be believable.",
      quitDayJobView:
        "Only moderate because the business could replace salary, but it does so with much harsher downside than the cleaner service targets.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark preserves far more simplicity for a first serious acquisition.",
      confidence:
        "Confidence is moderate on the big-picture shape, but the equipment and credential stack still need real diligence.",
    },
  },
  {
    businessName: "Resilient Commercial Trade Contractor with Commercial Focus",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/resilient-commercial-trade-contractor-with-commercial-focus/2201301/",
    category: "construction services",
    subcategory: "commercial trade contractor",
    location: "Colorado",
    stateCode: "CO",
    askingPrice: 3200000,
    revenue: 5200000,
    sde: 1144000,
    ebitda: 1020000,
    employees: 35,
    summary:
      "Colorado commercial trade contractor with 35 employees, strong disclosed cash flow, and a commercial-weighted revenue mix rather than a classic residential home-service profile.",
    whyItMayFit:
      "The economics are too material to ignore, and the employee count suggests something larger than an owner-operator subcontractor shop.",
    risks:
      "This likely depends on management depth, estimating discipline, customer concentration, and project mix in ways the public listing does not really unpack.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 3200000, revenue 5200000, SDE 1144000, EBITDA 1020000, 35 employees, Colorado location, and commercial trade-contractor framing. Inference: this is a serious company with real income-replacement power, but it is probably much heavier on estimating, backlog quality, and project execution than the original thesis lane. Missing: exact trade focus, customer concentration, backlog quality, management-org depth, and how much of the margin still depends on one owner-estimator relationship network.",
    tags: [
      "commercial-trade",
      "colorado",
      "construction",
      "large-team",
      "income-replacement",
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
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The economics are much larger, but the commercial-project and estimating risk move it out of the benchmark's simpler lane.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 4,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Backlog timing, retainage, and any bonding-working-capital needs can make the default close-cash range materially too low on a commercial contractor deal.",
    },
    analysis: {
      thesisFit:
        "Trackable because of the cash flow, but clearly outside the simpler service-business lane.",
      mainReasons:
        "Seven-figure SDE and a 35-person bench make it one of the biggest serious operating companies in the set.",
      failureModes:
        "Estimating misses, backlog deterioration, and relationship concentration can unwind commercial-trade economics quickly.",
      keepDayJobView:
        "Poor because this kind of contractor usually needs direct ownership attention on people, estimating, and customer commitments.",
      quitDayJobView:
        "Strong if the management layer is real because the earnings base is already meaningful.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is far simpler to own and underwrite, even if it is much smaller.",
      confidence:
        "Confidence is only moderate because the listing gives good headline numbers but still leaves the key transferability variables vague.",
    },
  },
  {
    businessName:
      "Commercial Tenant Finishing General Contractor: Strong Reputation",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/commercial-tenant-finishing-general-contractor-strong-reputation/2371828/",
    category: "construction services",
    subcategory: "tenant finishing general contractor",
    location: "Denver, CO",
    stateCode: "CO",
    askingPrice: null,
    revenue: 6636650,
    sde: 753363,
    ebitda: 603363,
    employees: 8,
    summary:
      "Denver tenant-finish general contractor with strong headline revenue, disclosed cash flow, and an eight-person employee base tied to commercial interior project work.",
    whyItMayFit:
      "The Denver location is personally relevant and the economics are good enough to watch, even though the business is clearly heavier than a classic route or home-service company.",
    risks:
      "Referral-engine dependence, backlog quality, estimator concentration, and project-execution risk are all likely more important here than the sparse public page implies.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: asking price undisclosed, revenue 6636650, SDE 753363, EBITDA 603363, 8 employees, Denver location, and commercial tenant-finishing GC positioning. Inference: the economics and geography make this worth tracking, but it is much riskier operationally than a cleaner recurring-service business. Missing: ask price, backlog detail, customer concentration, estimator-project-manager depth, and how much production quality still depends on the seller's relationships and judgment.",
    tags: [
      "tenant-finishing",
      "general-contractor",
      "denver",
      "commercial",
      "under-disclosed",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 1,
      transferabilityRating: 3,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 2,
      dataConfidenceScore: 2,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Denver geography helps, but hidden price and commercial GC execution risk keep it well behind the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "Without a disclosed ask, the simple scenario math is incomplete, and any backlog-working-capital requirement could further widen the true equity need.",
    },
    analysis: {
      thesisFit:
        "Relevant because of the economics and geography, but well outside the cleaner recurring-service thesis.",
      mainReasons:
        "There is enough revenue and cash flow here to justify attention if commercial-project risk is acceptable.",
      failureModes:
        "Backlog quality, estimator dependence, and execution misses can destroy a commercial GC story quickly.",
      keepDayJobView:
        "Poor because commercial tenant-finish work usually needs close operator supervision.",
      quitDayJobView:
        "Moderate to strong if the backlog and leadership bench are real, but that still requires an all-in owner.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is simpler, cheaper, and easier to diligence from public facts alone.",
      confidence:
        "Confidence is low because too many core underwriting details are still hidden.",
    },
  },
  {
    businessName: "Colorado Commercial Construction Company for Sale",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/colorado-commercial-construction-company-for-sale/2483319/",
    category: "construction services",
    subcategory: "commercial construction company",
    location: "Arapahoe County, CO",
    stateCode: "CO",
    askingPrice: null,
    revenue: null,
    sde: 1711014,
    ebitda: 1500000,
    employees: null,
    summary:
      "Arapahoe County commercial construction company with very large disclosed cash flow but extremely thin public detail on the actual revenue base, team, and customer mix.",
    whyItMayFit:
      "The earnings are too large to ignore, so it belongs in the tracker even though it may sit well outside the original simple-service strike zone.",
    risks:
      "The page is under-disclosed enough that the cash flow number could mislead without context on price, backlog, concentration, and management depth.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: asking price undisclosed, revenue undisclosed, SDE 1711014, EBITDA 1500000, and commercial construction positioning in Arapahoe County CO. Inference: the economics are material enough to track, but this is one of the thinnest public disclosures in the entire batch. Missing: asking price, revenue, employee count, trade mix, backlog, concentration, bonding-working-capital needs, and whether any of the earnings depend on one seller-led estimating relationship.",
    tags: [
      "commercial-construction",
      "arapahoe",
      "colorado",
      "under-disclosed",
      "large-cash-flow",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 1,
      transferabilityRating: 2,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 2,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 1,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 2,
      capexRisk: 3,
      regretIfWrongScore: 1,
      dataConfidenceScore: 1,
      keepDayJobFit: 1,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The earnings headline is far larger, but the disclosure is so thin that it does not challenge the benchmark on practical buyability.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 4,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "No credible cash-to-close view exists yet because the public listing omits the ask and too many of the working-capital variables that matter in commercial construction.",
    },
    analysis: {
      thesisFit:
        "Track only because the cash flow is huge; otherwise this is too thinly disclosed to rate highly.",
      mainReasons:
        "The earnings are simply too large to ignore entirely.",
      failureModes:
        "A commercial construction listing with hidden revenue, hidden price, and hidden staffing can produce a badly wrong first impression.",
      keepDayJobView:
        "Poor because even in the best case this would require an all-in ownership posture.",
      quitDayJobView:
        "Potentially strong in theory, but only after the hidden facts are surfaced and validated.",
      benchmarkComparison:
        "It does not beat the benchmark because the benchmark is a real, underwritable business from public facts while this one is still mostly a headline.",
      confidence:
        "Confidence is intentionally very low because the listing withholds too much to support strong judgment.",
    },
  },
  {
    businessName: "Chimney Cleaning and Repair Service - by Doug Jackson",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/chimney-cleaning-and-repair-service-by-doug-jackson/2359210/",
    category: "home services",
    subcategory: "chimney cleaning and repair",
    location: "Prince William, VA",
    stateCode: "VA",
    askingPrice: 329950,
    revenue: 1150000,
    sde: 275000,
    ebitda: null,
    employees: 7,
    summary:
      "Prince William chimney cleaning and repair business with seven employees, meaningful disclosed revenue, and a seller who still works full time in the operation.",
    whyItMayFit:
      "This is still a useful local comparison candidate because the price is understandable and the category is physically real, even if it is not a top overall winner.",
    risks:
      "The seller still operating full time, potential seasonality, and unclear service mix make it more owner-shaped than it first sounds.",
    brokerName: "Doug Jackson",
    brokerFirm: "Capital Business Brokers",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 329950, revenue 1150000, SDE 275000, 7 employees, Prince William VA, and the seller is stated to operate full time in the business. Inference: this is an interesting local non-plumbing comparison deal, but the seller's full-time role means the transferability story is weaker than the headline size suggests. Missing: exact service-mix split between cleaning and repair, seasonality, lead-tech depth, and how much of the customer and quote flow still rides on the seller personally.",
    tags: [
      "chimney",
      "prince-william",
      "local-comparison",
      "owner-shaped",
      "service-business",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 2,
      transferabilityRating: 3,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 5,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 2,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 4,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The local geography and low entry price are interesting, but the seller still being full time keeps it behind the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The simple loan math looks easy, but the real risk is paying for revenue that may still be tied closely to the seller's personal operating role.",
    },
    analysis: {
      thesisFit:
        "Useful local comp, but not a top target.",
      mainReasons:
        "The ask is understandable and the company has more staff than many tiny local trade listings.",
      failureModes:
        "Full-time seller involvement and possible seasonality could make the transfer much rougher than the revenue figure suggests.",
      keepDayJobView:
        "Weak because a seller-led chimney business is not an obvious delegated bridge play.",
      quitDayJobView:
        "Only moderate because the size is workable, but the likely owner dependence drags down conviction.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark has a clearer delegated-ownership story and less obvious seller-shape risk.",
      confidence:
        "Confidence is relatively good on the disclosed facts, but the real transferability still needs diligence.",
    },
  },
  {
    businessName: "Coastal Garage Door Service and Sales Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/coastal-garage-door-service-and-sales-company/2461562/",
    category: "home services",
    subcategory: "garage door service and sales",
    location: "Virginia",
    stateCode: "VA",
    askingPrice: 775000,
    revenue: 1500000,
    sde: 240000,
    ebitda: null,
    employees: 7,
    summary:
      "Virginia garage door service and sales company with seven employees, an experienced team, equipment in place, and an office manager handling day-to-day operations.",
    whyItMayFit:
      "The office-manager structure is stronger than most small trade listings and makes this more plausible as a bridge candidate than a typical owner-tech shop.",
    risks:
      "It still falls below the top salary-replacement tier, and garage-door work can carry field-execution and licensing complexity that the listing does not fully unpack.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 775000, revenue 1500000, SDE 240000, 7 employees, Virginia location, experienced team and equipment base, and an office manager said to handle day-to-day operations. Inference: the structure is better than the average small trade listing, but the post-debt earnings still look modest for a full-time jump. Missing: exact owner role today, whether the office manager truly runs dispatch and customer issues, any license-holder dependence, and the split between service, installation, and regional territory complexity.",
    tags: [
      "garage-door",
      "virginia",
      "office-manager",
      "bridge-candidate",
      "trade-services",
    ],
    legacyRatings: {
      ownerDependenceRating: 2,
      recurringRevenueRating: 2,
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
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 2,
      regretIfWrongScore: 4,
      dataConfidenceScore: 3,
      keepDayJobFit: 4,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.bridge_while_employed,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The office-manager setup is attractive, but the earnings are not strong enough to beat the benchmark on total thesis value.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The purchase price is still reasonable, but any hidden owner labor or licensing-transfer friction would make the modeled close-cash picture look better than reality.",
    },
    analysis: {
      thesisFit:
        "Better structure than most small trade deals, but still not a top income-replacement target.",
      mainReasons:
        "An office manager and a seven-person team create a more believable delegated setup than the average sub-$1M trade listing.",
      failureModes:
        "If the owner still handles key field, sales, or licensing issues, the delegated-ownership story weakens fast.",
      keepDayJobView:
        "Good enough to stay in the bridge lane if the office-manager claim is real.",
      quitDayJobView:
        "Weak because the earnings do not create a great cushion after debt and replacement labor.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark offers better overall upside with comparable operational clarity.",
      confidence:
        "Confidence is moderate because the structure sounds promising, but several of the most important transfer details are still hidden.",
    },
  },
  {
    businessName: "Profitable Residential Pest Control Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/profitable-residential-pest-control-company/2463031/",
    category: "home services",
    subcategory: "residential pest control",
    location: "Harrisburg, PA",
    stateCode: "PA",
    askingPrice: 1300000,
    revenue: 986922,
    sde: null,
    ebitda: 217881,
    employees: 7,
    summary:
      "Harrisburg residential pest control company with seven employees, a 70% recurring-revenue mix, and more than 90% residential exposure.",
    whyItMayFit:
      "The category is strong in theory because recurring residential pest work is route-like, practical, and usually resilient.",
    risks:
      "The price looks full relative to the disclosed EBITDA, and the listing still does not prove the real SDE or add-back story.",
    brokerName: "Duncan McMurchie",
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1300000, revenue 986922, EBITDA 217881, SDE undisclosed, 7 employees, 70% recurring revenue, and 90-plus percent residential mix. Inference: the category fit is good, but the valuation already looks aggressive unless the hidden add-backs are better than the public EBITDA suggests. Missing: normalized SDE, exact route density, licensing-holder setup, and proof that the owner cash after replacing owner labor is materially better than the disclosed EBITDA makes it look.",
    tags: [
      "pest-control",
      "harrisburg",
      "recurring-revenue",
      "residential",
      "valuation-risk",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 5,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 3,
      licenseDependency: 3,
      afterHoursBurden: 2,
      capexRisk: 1,
      regretIfWrongScore: 3,
      dataConfidenceScore: 3,
      keepDayJobFit: 3,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.neither,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The recurring mix is attractive, but the price looks too full relative to the disclosed public earnings for it to beat the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: 70,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The default loan math is not the real issue here; the bigger question is whether normalized SDE after replacing owner labor is strong enough to justify the asking price.",
    },
    analysis: {
      thesisFit:
        "Good category, weak valuation.",
      mainReasons:
        "Recurring residential pest routes and a seven-person team are the right shape for a practical service business.",
      failureModes:
        "If the real owner cash is closer to the disclosed EBITDA than to an attractive SDE, this quickly becomes a price-first problem.",
      keepDayJobView:
        "Moderate because recurring routes and a staffed team help, but only if the economics justify paying up.",
      quitDayJobView:
        "Weak for now because the valuation looks rich relative to the public earnings support.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark has cleaner public economics relative to price.",
      confidence:
        "Confidence is moderate because the recurring mix is concrete, but the hidden SDE is too important to ignore.",
    },
  },
  {
    businessName:
      "Established Dumpster Rental Business - 36 Years, Strong Cash Flow",
    sourceUrl:
      "https://www.bizquest.com/business-for-sale/established-dumpster-rental-business-36-years-strong-cash-flow/BW2487046/",
    category: "industrial services",
    subcategory: "dumpster rental",
    location: "Charlotte, NC",
    stateCode: "NC",
    askingPrice: 3480000,
    revenue: 2952795,
    sde: 741918,
    ebitda: null,
    employees: 9,
    summary:
      "Charlotte dumpster rental company with nine employees, 36 years of operating history, and strong disclosed cash flow, with inventory not included and real estate sold separately.",
    whyItMayFit:
      "This is a serious company with real cash flow and very physical-world demand, so it belongs on the board even if it is less lifestyle-simple than the best home-service targets.",
    risks:
      "Fleet and container capex, route-density execution, and any off-balance-sheet asset needs make the downside materially heavier than the cleaner HVAC-plumbing listings.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizQuest",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 3480000, revenue 2952795, SDE 741918, 9 employees, Charlotte NC, 36 years in business, inventory not included, and real estate separate-not included. Inference: this is a serious operating company with real earnings, but it is more fleet-and-asset heavy than the cleaner service businesses. Missing: fleet age, can-container replacement cycle, route density, landfill or disposal exposure, and how much of sales-pricing still depends on one owner relationship base.",
    tags: [
      "dumpster-rental",
      "charlotte",
      "industrial-services",
      "asset-heavy",
      "serious-company",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 2,
      transferabilityRating: 4,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 3,
      capexRisk: 5,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The earnings are much larger, but the asset-cycle burden makes it a different and riskier ownership proposition than the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Because inventory and real estate sit outside the ask, the real equity check can expand quickly once fleet reserve needs and working capital are underwritten honestly.",
    },
    analysis: {
      thesisFit:
        "Worth tracking as a serious company, but not a clean lifestyle-friendly service platform.",
      mainReasons:
        "Large real-world demand, long history, and meaningful cash flow make it hard to dismiss.",
      failureModes:
        "Asset replacement timing and route economics can eat up apparent cash generation if the fleet is older than the listing tone suggests.",
      keepDayJobView:
        "Weak to middling because dispatch, maintenance, and asset uptime still create real operating noise.",
      quitDayJobView:
        "Good if the asset base is healthy because the earnings already matter.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is simpler, cheaper, and less capex-sensitive.",
      confidence:
        "Confidence is relatively good on the disclosed facts, but asset diligence still drives the whole decision.",
    },
  },
  {
    businessName: "Northeast Virginia Multi-trade Company",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/northeast-virginia-multi-trade-company/2370942/",
    category: "home services",
    subcategory: "multi-trade hvac plumbing electrical",
    location: "Virginia",
    stateCode: "VA",
    askingPrice: 4800000,
    revenue: 5727659,
    sde: 696608,
    ebitda: null,
    employees: null,
    summary:
      "Northeast Virginia multi-trade company with a maintenance-agreement base, 16,000 active customers, and revenue concentrated in HVAC with smaller plumbing and electrical lines.",
    whyItMayFit:
      "This is one of the strongest local companies on paper because the customer base is real, the maintenance-agreement count is meaningful, and the category mix still sits inside the broad home-service lane.",
    risks:
      "The capital requirement is heavy, and the real transferability still depends on who runs dispatch, sales, and technical leadership across the three trade lines.",
    brokerName: "Patrick Lange",
    brokerFirm: "Business Modification Group",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 4800000, revenue 5727659, SDE 696608, Virginia location, 89% HVAC, 9% plumbing, 2% electrical, 2200 maintenance agreements, and 16000 active customers. Inference: this is one of the strongest local businesses on paper, but it also pushes far beyond the earlier smaller-capital lane. Missing: employee count, management-org depth, exact service-agreement economics, truck-fleet profile, and how much of the sales-estimating leadership still depends on one owner or lead manager.",
    tags: [
      "multi-trade",
      "virginia",
      "maintenance-agreements",
      "large-customer-base",
      "capital-heavy",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 5,
      transferabilityRating: 4,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 4,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 4,
      regretIfWrongScore: 2,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The business quality may be better on paper, but the capital requirement is so much heavier that it changes the lane rather than cleanly beating the benchmark.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "At this size the simple scenario understates the real close-cash need because fleet, working capital, and lender reserve expectations can all expand the equity check.",
    },
    analysis: {
      thesisFit:
        "Very strong local business, but only for the bigger-capital full-time lane.",
      mainReasons:
        "A large active-customer base and 2,200 maintenance agreements are serious structural positives.",
      failureModes:
        "Multi-trade leadership complexity and capital intensity can undo the appeal if the management layer is thinner than the listing suggests.",
      keepDayJobView:
        "Weak because the company is too large and too technical to treat as a passive bridge purchase.",
      quitDayJobView:
        "Strong if management depth is real because the customer base and service-agreement engine are meaningful.",
      benchmarkComparison:
        "It does not replace the benchmark because the benchmark preserves far more simplicity and financeability for a first serious deal.",
      confidence:
        "Confidence is relatively good on the broad shape because the listing gives real customer-base detail, but the org chart still matters a lot.",
    },
  },
  {
    businessName:
      "Desirable Commercial HVAC Co. Serving Maryland, Virginia & DC",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/desirable-commercial-hvac-co-serving-maryland-virginia-and-dc/2361177/",
    category: "construction services",
    subcategory: "commercial hvac",
    location: "Prince Georges County, MD",
    stateCode: "MD",
    askingPrice: 3750000,
    revenue: 6300000,
    sde: 1400000,
    ebitda: null,
    employees: null,
    summary:
      "Prince Georges County commercial HVAC company serving Maryland, Virginia, and DC, with very large disclosed revenue and cash flow relative to the rest of the local batch.",
    whyItMayFit:
      "The economics are too large to ignore and the geography is relevant, so this deserves a place in the tracker even though it is beyond the simpler strike zone.",
    risks:
      "Commercial HVAC qualification, certification, and management-depth risk are all meaningful, and the regional footprint adds more moving parts than the home-service alternatives.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 3750000, revenue 6300000, SDE 1400000, Prince Georges County MD, and a commercial HVAC service area spanning Maryland, Virginia, and DC. Inference: this is one of the strongest local income-replacement businesses discussed, but it clearly sits beyond the simpler first-acquisition lane. Missing: employee count, certification-credential stack, service versus project mix, customer concentration, and whether the seller or one lead estimator still anchors the commercial relationships.",
    tags: [
      "commercial-hvac",
      "maryland",
      "virginia",
      "dc",
      "income-replacement",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 3,
      transferabilityRating: 4,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 5,
      licenseDependency: 5,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The cash flow is far larger, but the commercial qualification and operating complexity move it well outside the benchmark's lane.",
      freshnessVerifiedAt: HIGH_VALUE_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The default model is almost certainly light here because working capital, credential transfer, and lender diligence on commercial concentration can all widen the actual equity need.",
    },
    analysis: {
      thesisFit:
        "Very strong income-replacement business, but beyond the simpler current strike zone.",
      mainReasons:
        "The earnings are substantial and the geography is relevant enough that it should not be ignored.",
      failureModes:
        "Commercial HVAC often hides credential, estimator, and relationship concentration risk behind attractive headline numbers.",
      keepDayJobView:
        "Poor because this would require direct ownership attention and commercial-operating depth.",
      quitDayJobView:
        "Strong if the management and credential stack are truly transferable, because the cash flow already matters.",
      benchmarkComparison:
        "It does not beat the benchmark because it changes the acquisition thesis into a bigger, more technical commercial play.",
      confidence:
        "Confidence is moderate because the public facts are directionally useful, but the organizational detail is still too thin for high conviction.",
    },
  },
].map((seed) => ({
  ...seed,
  managedBusinessData: buildManagedBusinessData(seed),
})) satisfies Array<
  HighValueListingSeedInput & {
    managedBusinessData: Prisma.BusinessCreateInput;
  }
>;
