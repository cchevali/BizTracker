import { Prisma } from "../src/generated/prisma/client";
import {
  DealStatus,
  PrimaryUseCase,
  type PrimaryUseCase as PrimaryUseCaseValue,
} from "../src/generated/prisma/enums";
import { deriveOverallScoreFromRatings } from "../src/features/businesses/domain/business-score";

export const RESEARCHED_LISTING_BATCH_DATE = "2026-04-14";
export const RESEARCHED_LISTING_NOTE_HEADING = `Backfill analysis (${RESEARCHED_LISTING_BATCH_DATE})`;
export const RESEARCHED_LISTING_VERIFIED_AT = new Date(
  "2026-04-14T16:00:00-04:00",
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
    businessName: "19 FedEx Ground Routes, Colorado Springs, CO",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/19-fedex-ground-routes-colorado-springs-co/2415787/",
    category: "route services",
    subcategory: "fedex ground routes",
    location: "Colorado Springs, CO",
    stateCode: "CO",
    askingPrice: 1150000,
    revenue: 2925580,
    sde: 891849,
    ebitda: 891849,
    employees: 25,
    summary:
      "Colorado Springs FedEx Ground package with 19 routes, 25 full-time employees, seller financing, and a full-time manager already in place; notably, no fleet is included in the sale.",
    whyItMayFit:
      "One of the strongest pure income-replacement candidates from the mountain-west family-market search because the manager-in-place setup and very high disclosed cash flow make the delegation story more believable than most small route packages.",
    risks:
      "FedEx concentration is the main risk, and the no-fleet structure needs clarification because it could change the economics materially. Semi-absentee positioning may depend too heavily on one manager plus stable driver retention.",
    brokerName: null,
    brokerFirm: "myfxgroutes.com",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1150000, revenue 2925580, SDE and EBITDA 891849, Colorado Springs CO, 25 full-time employees, 19 FedEx P&D routes, seller financing available, no fleet included in the sale, and a full-time manager already in place with listing language aimed at semi-absentee ownership. Inference: this is one of the more believable large route packages in the current tracker because the manager-in-place setup and disclosed earnings are both real strengths, but the no-fleet structure is unusual enough that the true economics could shift materially once vehicle obligations are surfaced. Missing: exact route settlement history, who owns or leases the trucks today, terminal concentration, manager compensation-authority details, and whether the owner still handles hiring, compliance exceptions, or FedEx relationship management personally. Top 3 follow-up questions: 1) If no fleet is included, what truck ownership or lease obligations actually sit behind the routes today and what transfers to the buyer? 2) What do the last 24 months of route-level settlement, safety, and service metrics look like by terminal and route cluster? 3) How autonomous is the full-time manager on dispatch, driver discipline, hiring, and day-to-day FedEx communication?",
    tags: [
      "fedex",
      "ground-routes",
      "colorado-springs",
      "seller-financing",
      "manager-in-place",
      "no-fleet",
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
      sellerFinancingAvailable: true,
      sellerFinancingNotes: "Listing says seller financing is available.",
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 4,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 4,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: true,
      benchmarkNotes:
        "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. This beats the route benchmark for income replacement and delegated scale, even though it gives up simplicity and still concentrates the bet heavily on FedEx plus one manager.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: true,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The standard 14% to 20% model is only a baseline here because the no-fleet structure could hide lease assumptions, transfer fees, or reserve needs that change the real buyer cash requirement materially.",
    },
    analysis: {
      thesisFit:
        "Very strong route-business candidate for income replacement, though still not a truly passive ownership story.",
      mainReasons:
        "Disclosed cash flow, a real manager-in-place setup, and seller financing make this meaningfully more believable than a typical owner-driver route package.",
      failureModes:
        "FedEx dependency, driver-manager turnover, and unclear vehicle economics can all break the semi-absentee story quickly.",
      keepDayJobView:
        "Good if the no-fleet arrangement is clean and the manager really owns dispatch and labor issues day to day.",
      quitDayJobView:
        "Strong because the disclosed earnings already clear the income-replacement bar by a wide margin.",
      benchmarkComparison:
        "It beats the current route benchmark on scale and earnings, but it does so by taking on much more concentration risk.",
      confidence:
        "Confidence is fairly good on the headline facts, but still only moderate on true transferability until the manager and fleet structure are documented better.",
    },
  },
  {
    businessName: "20 FedEx Ground Routes, Colorado Springs, CO",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/20-fedex-ground-routes-colorado-springs-co/2458359/",
    category: "route services",
    subcategory: "fedex ground routes",
    location: "Colorado Springs, CO",
    stateCode: "CO",
    askingPrice: 1350000,
    revenue: 3000000,
    sde: 826405,
    ebitda: 826405,
    employees: 28,
    summary:
      "Colorado Springs FedEx Ground package with 20 routes, 28 full-time employees, seller financing, and 24 trucks included in the sale.",
    whyItMayFit:
      "Big disclosed earnings and route density make this a real income-replacement candidate, especially if the operating bench is strong enough to support delegated ownership.",
    risks:
      "This version carries more truck and maintenance exposure than the other Colorado Springs FedEx package, and the route business still has the usual FedEx concentration and labor-retention risk.",
    brokerName: "John",
    brokerFirm: "myfxgroutes.com",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1350000, revenue 3000000, SDE and EBITDA 826405, Colorado Springs CO, 28 full-time employees, 20 FedEx P&D routes, 24 trucks included in the sale, seller financing available, and listing language that says less than 10% down may be possible. Inference: this is still a serious route-business income-replacement candidate, but it looks less clean than the other Colorado Springs package because the included fleet adds more capex and maintenance burden while the management depth is not surfaced as clearly. Missing: exact truck age-mileage profile, route-level settlement history, whether a manager or lead dispatcher already runs the day-to-day schedule, terminal concentration, and how much deferred vehicle capex is hiding behind the public story. Top 3 follow-up questions: 1) What are the age, mileage, maintenance status, and replacement timeline for all 24 trucks included in the sale? 2) What do the last 24 months of route-level settlement, service, and safety metrics look like by route cluster? 3) Who actually runs dispatch, hiring, driver discipline, and FedEx communication today if the current owner is out for a week?",
    tags: [
      "fedex",
      "ground-routes",
      "colorado-springs",
      "seller-financing",
      "fleet-included",
      "trucks",
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
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller financing is available and references less than 10% down.",
      operatorSkillDependency: 2,
      licenseDependency: 2,
      afterHoursBurden: 4,
      capexRisk: 4,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 3,
      quitDayJobFit: 5,
      primaryUseCase: PrimaryUseCase.either,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Flowers Bread Route, Fairfax County, Virginia as the route benchmark. This has much more earnings power than the benchmark, but the included-fleet burden and less-clear management depth make it a different, riskier ownership story rather than a clean benchmark winner.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "The listing's sub-10%-down pitch is directionally helpful, but fleet reserves, transfer costs, and any lender haircut on vehicle condition can still push the true buyer cash need above the simple model range.",
    },
    analysis: {
      thesisFit:
        "Strong route-business income-replacement candidate, but less elegant than the no-fleet Colorado Springs package.",
      mainReasons:
        "Disclosed earnings, route density, and seller-financing language keep it firmly in the real-candidate bucket.",
      failureModes:
        "Fleet refresh costs, FedEx dependency, and labor-management strain can make the public SDE story degrade quickly after close.",
      keepDayJobView:
        "Only moderate because the public page does not prove a manager-in-place bench the way the sister listing does.",
      quitDayJobView:
        "Strong because the earnings can still replace income decisively if the truck burden is honestly underwritten.",
      benchmarkComparison:
        "It out-earns the route benchmark by a lot, but it also moves much further away from the benchmark's simplicity and lower downside.",
      confidence:
        "Confidence is good on the topline facts and weaker on the operating bench because the listing leaves too much of the labor-management structure implicit.",
    },
  },
  {
    businessName: "Commercial Real Estate Service",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/commercial-real-estate-service/2206744/",
    category: "real estate services",
    subcategory: "commercial real estate services",
    location: "Midvale, UT",
    stateCode: "UT",
    askingPrice: 1500000,
    revenue: 909000,
    sde: 735486,
    ebitda: 735486,
    employees: 1,
    summary:
      "Midvale commercial real-estate services/development business with one employee, shared-office plus home-based operations, seller financing, and very high disclosed cash flow relative to revenue.",
    whyItMayFit:
      "Strong headline economics and low physical-capex needs make it interesting on paper.",
    risks:
      "This reads much more like an owner-expertise land/development and entitlement business than a clean delegable service operation. Transferability is the core issue, and the owner's 33 years of experience looks important to the result.",
    brokerName: "Michael Drury",
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1500000, revenue 909000, SDE and EBITDA 735486, Midvale UT, one employee, shared office plus home-office operations, seller financing available with 30% down for a qualified buyer, and listing language that centers on buying, rezoning, entitling, subdividing, and quick-flip commercial real estate development. The page also says the owner has 33 years of experience available for continued support. Inference: the headline cash flow is attractive, but this reads much more like a seller-shaped land-development and entitlement business than a clean, transferable service company with a real bench. Missing: what percentage of results come from the owner's personal sourcing and entitlement judgment, whether any licensed broker-developer role is required for continuity, how repeatable the pipeline is without the seller, and whether the current lease and home-based setup reflect stale public listing detail. Top 3 follow-up questions: 1) What specific owner activities drive deal sourcing, rezoning, entitlement, and resale execution today? 2) How much of the pipeline is already under option or contract versus dependent on new deal origination after close? 3) Which relationships, licenses, or local-government approvals are effectively seller-specific rather than business-owned?",
    tags: [
      "commercial-real-estate",
      "midvale",
      "home-based",
      "seller-financing",
      "land-development",
      "owner-expertise",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 1,
      transferabilityRating: 2,
      scheduleControlFitRating: 3,
      brotherOperatorFitRating: 2,
    },
    manual: {
      aiResistanceScore: 4,
      financeabilityRating: 3,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says seller financing is available with 30% down for a qualified buyer.",
      operatorSkillDependency: 5,
      licenseDependency: 2,
      afterHoursBurden: 2,
      capexRisk: 1,
      regretIfWrongScore: 2,
      dataConfidenceScore: 3,
      keepDayJobFit: 1,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Midvale listing has better headline margins, but the owner-expertise and land-entitlement dependence keep it well behind the benchmark for a practical first acquisition.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 4,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The simple model is directionally fine on purchase-price math, but transferability and deal-pipeline fragility matter much more here than the base loan structure.",
    },
    analysis: {
      thesisFit:
        "Trackable only because the cash flow is unusually strong on paper; otherwise it sits outside the cleaner boring-business lane.",
      mainReasons:
        "High cash flow, low physical capex, and seller financing make it look interesting enough to underwrite at least once.",
      failureModes:
        "If the seller's judgment, sourcing, and entitlement experience are the real product, then the business may not transfer in a durable way at all.",
      keepDayJobView:
        "Very poor because this looks too seller-expertise driven to run credibly as a sidecar acquisition.",
      quitDayJobView:
        "Only moderate because the earnings could replace income, but they may do so by buying a specialized operator role rather than a clean business.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is a more transferable operating system and this looks closer to buying one expert's dealmaking edge.",
      confidence:
        "Confidence is moderate on the public facts and intentionally low on transferability until the seller-specific role is separated from the company.",
    },
  },
  {
    businessName:
      "Company w/ High Gross Profits - Property Damage & Restoration",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/company-w-high-gross-profits-property-damage-and-restoration/2306305/",
    category: "home services",
    subcategory: "property damage restoration franchise",
    location: "Grand Rapids, MI",
    stateCode: "MI",
    askingPrice: 140000,
    revenue: 2500000,
    sde: 800000,
    ebitda: null,
    employees: 4,
    summary:
      "Home-based property-damage restoration business framed as executive-run, with four employees, full training/support, and insurance-account-driven demand - but with a major public price anomaly.",
    whyItMayFit:
      "The category is need-driven, insurance-linked, and the listing claims owner-friendly hours plus substantial support.",
    risks:
      "Public listing quality is poor. The asking price looks implausibly low relative to stated SDE, and the same ad family looks anomalous enough that the economics should not be trusted without broker backup.",
    brokerName: "Chris Pramber",
    brokerFirm: "PramberNow",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: public ad 2306305 shows ask 140000, revenue 2500000, SDE 800000, EBITDA not disclosed, Grand Rapids MI location, four employees, home-based operations, executive-run framing, third-party financing available, full training and support, and insurance-account language around fire, water, storm, content cleanup, remediation, and mold work. Inference: the category is attractive and the demand drivers are believable, but the public page quality is weak enough that the asking price looks like an obvious anomaly rather than a number to underwrite at face value. Missing: broker-backed confirmation that the 140000 ask is real, any franchise or territory economics behind the listing, normalized owner-replacement EBITDA after royalties or lead fees, whether the executive-run claim means a true manager-in-place setup, and how transferable the insurer-vendor relationships really are. Top 3 follow-up questions: 1) Can the broker confirm in writing that the real asking price is actually 140000 and not a misplaced decimal or template error? 2) What does normalized owner-replacement cash flow look like after royalties, lead fees, management payroll, and working-capital needs? 3) How much of production, estimating, and insurer-vendor relationship management still depends on one owner or lead operator today?",
    tags: [
      "restoration",
      "property-damage",
      "grand-rapids",
      "home-based",
      "price-anomaly",
      "insurance-accounts",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 3,
      transferabilityRating: 3,
      scheduleControlFitRating: 4,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 2,
      sellerFinancingAvailable: false,
      sellerFinancingNotes:
        "No seller financing is disclosed; the public listing says third-party financing is available.",
      operatorSkillDependency: 3,
      licenseDependency: 2,
      afterHoursBurden: 3,
      capexRisk: 1,
      regretIfWrongScore: 4,
      dataConfidenceScore: 1,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The restoration category is attractive, but the public asking price on ad 2306305 looks anomalous enough that this cannot beat the benchmark without broker-backed economics first.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 4,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 3,
      cashToCloseNotes:
        "Do not anchor to the public 140000 ask without broker backup. The tracker stores that raw public number on purpose, but the real close-cash need could be radically different if the ask is a listing anomaly or if working capital, equipment, or franchise fees are understated.",
    },
    analysis: {
      thesisFit:
        "Interesting enough to track because the category is need-driven, but too noisy publicly to treat as a clean candidate yet.",
      mainReasons:
        "Insurance-linked demand, executive-run framing, and real support infrastructure are all directionally attractive for a first-pass screen.",
      failureModes:
        "The public economics may simply be wrong, and even if they are not, hidden manager or insurer-relationship dependence could still make transferability much weaker than advertised.",
      keepDayJobView:
        "Only moderate because the owner-friendly-hours pitch is nice, but restoration work can still create urgent operational demands behind the scenes.",
      quitDayJobView:
        "Potentially good if the cash flow is real, but the price anomaly keeps that judgment provisional.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark has cleaner public economics and this listing needs broker-level fact repair before serious underwriting.",
      confidence:
        "Confidence is intentionally very low because the public asking price looks anomalous and should not be trusted without direct confirmation.",
    },
  },
  {
    businessName:
      "Grand Rapids, MI - Automotive Paint & Dent Repair Multi-Unit Franchise",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/grand-rapids-mi-automotive-paint-and-dent-repair-multi-unit-franchise/2238488/",
    category: "auto services",
    subcategory: "collision / auto paint franchise",
    location: "Grand Rapids, MI",
    stateCode: "MI",
    askingPrice: 1782500,
    revenue: 4456250,
    sde: null,
    ebitda: 713000,
    employees: 12,
    summary:
      "Grand Rapids multi-unit auto paint and dent franchise with 12 employees, retail plus fleet revenue, strong brand awareness, and a support model aimed at owners who want to scale.",
    whyItMayFit:
      "More platform-like than a single-shop body business because the listing emphasizes multi-unit scalability, fleet accounts, and a proven playbook.",
    risks:
      "SDE is undisclosed, franchise economics matter, and collision/paint operations can hide real manager, workflow, and insurer complexity behind a clean EBITDA number.",
    brokerName: null,
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1782500, revenue 4456250, EBITDA 713000, SDE not disclosed, Grand Rapids MI, 12 employees, established franchise positioning, high customer retention across both retail and fleet, support geared toward multi-unit scalability, and detailed-location text that says the real estate is owned even though the top financial summary says real estate is not disclosed. Inference: this is more interesting than a generic owner-operated body shop because it may already have some scale and process, but missing SDE plus mixed real-estate disclosure still leave too much room for the EBITDA story to flatter reality. Missing: exact number of operating units, normalized owner cash after franchise fees and management payroll, unit-level margin spread between retail and fleet work, how dependent results are on local estimators-managers, and whether insurer-fleet relationships are company-owned or seller-owned. Top 3 follow-up questions: 1) What is true trailing twelve month SDE after all franchise fees, local management payroll, and normalized owner replacement costs? 2) How many units are included, and what are revenue, EBITDA, and leadership depth by location? 3) Why does the public page conflict on real-estate treatment, and what assets are actually included in the ask?",
    tags: [
      "auto-paint",
      "dent-repair",
      "grand-rapids",
      "franchise",
      "fleet-accounts",
      "multi-unit",
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
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Grand Rapids business is larger and has cleaner EBITDA disclosure than the Pittsburgh variant, but franchise-collision complexity and missing SDE still keep it behind the benchmark for a first deal.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: false,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "Because SDE is undisclosed and the public page conflicts on real-estate treatment, the shared model is only a rough baseline here; franchise transfer costs, equipment needs, and working-capital gaps could all widen the real equity check.",
    },
    analysis: {
      thesisFit:
        "Potentially meaningful operator business, but still operationally heavier and less transparent than the cleaner service-business targets.",
      mainReasons:
        "Multi-unit framing, fleet revenue, and franchise systems at least create the possibility of a scalable platform instead of a one-shop owner trade.",
      failureModes:
        "Hidden SDE, weak local leadership, and insurer-fleet concentration can quickly unravel the apparent scalability story.",
      keepDayJobView:
        "Poor because collision and fleet-account operations still look too manager-sensitive for believable sidecar ownership from public facts alone.",
      quitDayJobView:
        "Reasonable only if the unit managers are strong and the undisclosed owner cash actually supports the purchase price.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is simpler, smaller, and easier to underwrite from public information.",
      confidence:
        "Confidence is moderate because the page gives enough shape to track, but not enough cash-flow detail to trust fully yet.",
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
