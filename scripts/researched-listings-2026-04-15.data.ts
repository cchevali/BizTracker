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
  "2026-04-15T15:30:00-04:00",
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
    businessName: "Growing Central Ohio Plumbing Business for Sale",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/growing-central-ohio-plumbing-business-for-sale/2464974/",
    category: "home services",
    subcategory: "plumbing, drain and sewer, excavation",
    location: "Franklin County, OH",
    stateCode: "OH",
    askingPrice: 1700000,
    revenue: 1800000,
    sde: 500000,
    ebitda: null,
    employees: 16,
    summary:
      "Franklin County plumbing company in sale-pending status with 16 employees, a full interior-plumbing service line, and additional drain, sewer, and excavation work.",
    whyItMayFit:
      "This is one of the stronger current good-money plus better-location candidates because it sits in the preferred essential local-service lane, the Columbus market is directionally attractive for family and hockey reasons, and the page describes a real team instead of a solo-owner trade shop.",
    risks:
      "Sale-pending status may make it unavailable, and plumbing-license transfer, field leadership depth, and after-hours drain-sewer burden could all make the turnkey story weaker than the public page suggests.",
    brokerName: "Jeff Miller",
    brokerFirm: "Transworld Business Advisors of Southern Ohio",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.LETTER_OF_INTENT,
    notes:
      "Observed: the live page currently shows Sale Pending, ask 1700000, revenue 1800000, SDE 500000, Franklin County OH, 16 employees, 14 technicians plus 2 office staff, 2020 establishment, 2-week transition support, and service lines covering interior plumbing, drain and sewer, and excavation tied to home foundation repair. Inference: this is a stronger-than-usual essential-service candidate because the public staffing depth is real and the service mix is closer to the preferred plumbing-plus-drain lane than a simple one-truck shop, but the public pending status and unclear license-holder structure mean the transfer story should still be treated skeptically. Missing: who holds the key plumbing credentials today, how often drain-sewer-excavation work creates nights and weekend escalations, whether one field lead or estimator still anchors the workflow, and how much repeat maintenance versus one-off call volume sits inside the revenue. Top 3 follow-up questions: 1) Which individual currently holds the critical plumbing licenses and what is the exact post-close transfer or replacement plan? 2) How much of weekly dispatch, estimating, and field escalation still routes through the owner versus the office team or lead technicians? 3) What percentage of revenue and gross profit comes from standard plumbing service versus drain-sewer-excavation jobs with heavier emergency and equipment demands?",
    tags: [
      "plumbing",
      "drain-sewer",
      "excavation",
      "columbus",
      "pending",
      "essential-services",
      "quit-job-candidate",
    ],
    legacyRatings: {
      ownerDependenceRating: 3,
      recurringRevenueRating: 3,
      transferabilityRating: 4,
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
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 2,
      quitDayJobFit: 4,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. Columbus geography and the public team depth are attractive, but sale-pending status plus plumbing-drain licensing and after-hours risk keep this from clearly beating the benchmark today.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 1,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 4,
      cashToCloseNotes:
        "The headline purchase math is workable, but excavation equipment needs, drain-sewer job working capital, and any required licensed-operator replacement can still push real buyer cash above the simple model range.",
    },
    analysis: {
      thesisFit:
        "Strong essential-service candidate worth keeping in the tracker even in sale-pending status.",
      mainReasons:
        "Preferred local-service category, a public 16-person bench, and enough cash flow to matter make this more serious than most smaller plumbing ads.",
      failureModes:
        "License-holder dependence, emergency drain-sewer burden, and one hidden field leader or estimator being the real operator could all break the turnkey thesis.",
      keepDayJobView:
        "Only middling because the team is encouraging, but plumbing plus drain-sewer work can still create enough noise to pull ownership back in fast.",
      quitDayJobView:
        "Good because the earnings are strong enough to support a household if the public staffing depth is real and the pending status still leaves room to buy.",
      benchmarkComparison:
        "It stays just behind the benchmark for now because the benchmark is simpler and more available, even though Columbus and the service mix are strategically appealing.",
      confidence:
        "Confidence is reasonably good on the public facts and only moderate on transferability until the license chain and owner role are documented.",
    },
  },
  {
    businessName: "Residential HVAC Company - Southeast Michigan",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/residential-hvac-company-southeast-michigan/2455495/",
    category: "home services",
    subcategory: "residential hvac",
    location: "Southeast Michigan, MI",
    stateCode: "MI",
    askingPrice: 889000,
    revenue: 744301,
    sde: 320000,
    ebitda: null,
    employees: 4,
    summary:
      "Southeast Michigan residential HVAC company with four employees, limited seller financing, and an explicit requirement that the buyer hold or hire for Michigan mechanical licensure.",
    whyItMayFit:
      "The location fit is strong enough to keep it on the tracker, the price-to-SDE is understandable, and the limited seller-financing language makes it at least practically financeable.",
    risks:
      "The mechanical-license dependency is the main caution, and the small bench plus only borderline income-replacement economics make this a candidate to track conservatively rather than a top-tier target.",
    brokerName: "Nathan Brandt",
    brokerFirm: "Sunbelt Business Brokers",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 889000, revenue 744301, SDE 320000, Michigan relocatable page with a Southeast Michigan title, 4 employees, 2011 establishment, limited seller financing available, 4 weeks of support, and explicit buyer requirements around holding one of Michigan's mechanical contractor licenses (10e, 2, 3, or 7) or employing somebody who does. The page says the equipment is stored on the current owner's property and a new owner would likely need either a lease there or a new office-warehouse setup. Inference: this is worth tracking because the geography is attractive and the public valuation is not crazy, but the listing reads much more like a small licensed trade operation than a clean manager-run service company. Missing: what percentage of work is maintenance versus reactive replacement, which individual currently holds the key licenses and customer trust, whether any dispatcher-office role exists beyond the four listed employees, and how much working capital or relocation cost is needed to stand up a new facility if the owner's property is not retained. Top 3 follow-up questions: 1) Who currently holds the mechanical licenses and what exact plan keeps that credential coverage in place on day one after close? 2) What share of revenue comes from recurring maintenance agreements versus one-off installs and replacements? 3) How much owner involvement still sits in quoting, scheduling, and high-value customer relationships today?",
    tags: [
      "hvac",
      "southeast-michigan",
      "seller-financing",
      "essential-services",
      "watchlist",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 2,
      transferabilityRating: 2,
      scheduleControlFitRating: 2,
      brotherOperatorFitRating: 4,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 4,
      sellerFinancingAvailable: true,
      sellerFinancingNotes:
        "Listing says limited seller financing is available.",
      operatorSkillDependency: 5,
      licenseDependency: 5,
      afterHoursBurden: 3,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 4,
      keepDayJobFit: 1,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Michigan location is strategically better for family fit, but the small bench, explicit license dependency, and only borderline income replacement keep it behind the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The purchase price and limited seller financing are directionally helpful, but any need to replace the licensed operator or stand up a new facility can widen the real buyer cash need quickly.",
    },
    analysis: {
      thesisFit:
        "Trackable because the geography and price are practical, but not a clean first-choice HVAC target.",
      mainReasons:
        "Southeast Michigan is a strong family-market fit and the valuation is realistic enough to keep on the board.",
      failureModes:
        "Mechanical-license transfer risk, a small four-person bench, and hidden owner dependence in quoting or scheduling can all undermine the post-close plan.",
      keepDayJobView:
        "Poor because this looks too license-dependent and too small to support credible sidecar ownership.",
      quitDayJobView:
        "Only moderate because the economics can work on paper, but probably without a lot of cushion after debt, benefits, and any operator replacement cost.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is simpler, a little better disclosed, and less obviously dependent on one credential chain.",
      confidence:
        "Confidence is decent on the public facts and intentionally cautious on transferability because the key license issue is explicit but unresolved.",
    },
  },
  {
    businessName: "High-end Residential Remodeling and contracting service",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/high-end-residential-remodeling-and-contracting-service/2458857/",
    category: "construction services",
    subcategory: "residential remodeling and contracting",
    location: "Fairfax County, VA",
    stateCode: "VA",
    askingPrice: 1795000,
    revenue: 3500000,
    sde: 881782,
    ebitda: 799218,
    employees: null,
    summary:
      "Fairfax County home-based high-end residential remodeling and contracting business with strong paper cash flow, owner-listed marketing, and contractor-heavy execution risk.",
    whyItMayFit:
      "The paper economics are strong enough to warrant tracking, and the Fairfax location remains strategically relevant even though the operating shape is rougher than the cleaner service-business targets.",
    risks:
      "The public page is inconsistent on SDE, the business is owner-listed and home-based, and project-estimating, licensing, subcontractor, and key-person dependence all look high.",
    brokerName: "Evan Karns",
    brokerFirm: null,
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1795000, revenue 3500000, top-line page cash flow 881782, EBITDA 799218, Fairfax County VA relocatable listing, home-based operations, first-owner sale, 4 weeks of support, and owner-listed positioning that says the company has served 202 affluent households over the last decade with custom kitchens, bathrooms, additions, whole-home renovations, and outdoor projects. The description also claims 2024 SDE of 1013212 and says 2025 annualized actual is 881781 before possible add-backs, which creates an immediate consistency problem in the public numbers. Inference: this is financially attractive enough on paper to track, but it looks much more like buying a seller-shaped project engine than acquiring a clean manager-run service company. Missing: employee and subcontractor bench detail, backlog and work-in-progress quality, who estimates and sells the jobs today, which licenses or permits are effectively seller-linked, and whether the strong margins survive a true owner-replacement payroll assumption. Top 3 follow-up questions: 1) What is true trailing twelve month owner-replacement SDE after removing aggressive add-backs and pricing in a working general manager-estimator? 2) How much of current revenue depends on the seller personally winning, scoping, or managing jobs? 3) What are current backlog, gross-margin fade, and working-capital swings by job type over the last 12 to 24 months?",
    tags: [
      "remodeling",
      "fairfax",
      "home-based",
      "watchlist",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 1,
      transferabilityRating: 2,
      scheduleControlFitRating: 1,
      brotherOperatorFitRating: 3,
    },
    manual: {
      aiResistanceScore: 5,
      financeabilityRating: 3,
      sellerFinancingAvailable: null,
      sellerFinancingNotes: null,
      operatorSkillDependency: 5,
      licenseDependency: 4,
      afterHoursBurden: 4,
      capexRisk: 2,
      regretIfWrongScore: 4,
      dataConfidenceScore: 2,
      keepDayJobFit: 1,
      quitDayJobFit: 3,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The paper cash flow is larger, but the inconsistent SDE story, home-based setup, and contractor-heavy execution risk keep it well behind the benchmark for a practical first acquisition.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 2,
      homeBasedFlag: true,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "The simple loan model is not the hard part here. Backlog quality, margin fade, subcontractor float, and owner-replacement payroll are much more likely to change the real economics than the base debt assumptions.",
    },
    analysis: {
      thesisFit:
        "Trackable only because the paper cash flow is strong; operationally it sits outside the cleaner boring-business lane.",
      mainReasons:
        "Large apparent earnings and relevant local geography make it too financially meaningful to ignore entirely.",
      failureModes:
        "Seller-led estimating, inconsistent public SDE figures, and project-management chaos could make the business far less transferable than the listing implies.",
      keepDayJobView:
        "Very poor because remodeling and general-contracting execution almost always pull ownership into daily decisions.",
      quitDayJobView:
        "Only moderate because the economics could replace income, but they may do so by forcing the buyer to become the next key operator rather than own a stable system.",
      benchmarkComparison:
        "It remains behind the benchmark because the benchmark is cleaner, more repeatable, and far easier to underwrite from public information.",
      confidence:
        "Confidence is intentionally low because the public page conflicts on SDE and leaves the operating bench almost completely implicit.",
    },
  },
  {
    businessName: "Longstanding Commercial HVAC Business - SBA Pre-Qualified",
    sourceUrl:
      "https://www.bizbuysell.com/business-opportunity/longstanding-commercial-hvac-business-sba-pre-qualified/2388349/",
    category: "construction services",
    subcategory: "commercial hvac",
    location: "Charlotte, NC",
    stateCode: "NC",
    askingPrice: 1799000,
    revenue: null,
    sde: null,
    ebitda: null,
    employees: 6,
    summary:
      "Charlotte commercial HVAC and refrigeration business with six employees, more than 80 maintenance accounts, and 24/7 service positioning, but with no public cash-flow disclosure.",
    whyItMayFit:
      "Charlotte is a better family-market location than several other comparable candidates, and the maintenance-account angle makes this worth keeping on the list despite weak financial disclosure.",
    risks:
      "Cash flow is undisclosed, the owner is described as full-time in operations, scheduling, and client relations, and the commercial-HVAC plus emergency-service burden makes transferability much less certain than the public page suggests.",
    brokerName: "Michael Norman",
    brokerFirm: "The CBA Group",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    notes:
      "Observed: ask 1799000, Charlotte NC location, no public revenue, SDE, or EBITDA disclosure, established 2001, 6 employees, 14 days of support, retirement reason, and a description highlighting more than 80 maintenance service accounts, commercial HVAC, refrigeration, energy controls, same-day service, and 24/7 emergency response. The page says the company uses digital diagnostics and CRM tools, but it also states that the current owner remains involved full-time in operations, scheduling, and high-level client relations. The top summary says real estate is not disclosed while the detailed section says real estate is owned. Inference: the maintenance-account angle and Charlotte location make this interesting enough to track, but the public page still reads like an owner-shaped commercial trade company rather than a cleanly delegated service platform. Missing: actual trailing cash flow, the mix between recurring maintenance and one-off project work, credential and license-holder structure, who covers nights and emergency dispatch, and whether any second-in-command exists below the owner today. Top 3 follow-up questions: 1) What are trailing twelve month revenue, SDE, and EBITDA, and how much of that comes from recurring maintenance agreements versus projects or emergency calls? 2) Which credentials, licenses, or customer relationships are effectively owner-specific today? 3) If the owner is out for a week, who handles scheduling, dispatch, quoting, and senior client communication right now?",
    tags: [
      "hvac",
      "commercial-hvac",
      "charlotte",
      "essential-services",
      "watchlist",
    ],
    legacyRatings: {
      ownerDependenceRating: 4,
      recurringRevenueRating: 4,
      transferabilityRating: 2,
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
      afterHoursBurden: 5,
      capexRisk: 3,
      regretIfWrongScore: 3,
      dataConfidenceScore: 2,
      keepDayJobFit: 1,
      quitDayJobFit: 2,
      primaryUseCase: PrimaryUseCase.full_time_replacement,
      beatsCurrentBenchmark: false,
      benchmarkNotes:
        "Compared against Profitable HVAC Air Quality & Duct Cleaning Business Franchise in Fairfax County. The Charlotte location and maintenance-account angle are attractive, but undisclosed cash flow plus obvious owner involvement keep this well behind the benchmark.",
      freshnessVerifiedAt: RESEARCHED_LISTING_VERIFIED_AT,
      staleListingRisk: 3,
      homeBasedFlag: null,
      recurringRevenuePercent: null,
      ownerHoursClaimed: null,
      opsManagerExists: null,
      keyPersonRisk: 5,
      cashToCloseNotes:
        "SBA pre-qualified language is directionally helpful, but without disclosed cash flow and with conflicting real-estate disclosure, the shared cash-to-close model is only a rough placeholder here.",
    },
    analysis: {
      thesisFit:
        "Interesting enough to track, but clearly lower confidence than the cleaner disclosed home-service candidates.",
      mainReasons:
        "Charlotte geography plus more than 80 maintenance accounts create enough strategic appeal to justify a first-pass record.",
      failureModes:
        "No public cash flow, commercial-trade credential concentration, and the owner's visible role in scheduling and client relations can all make the business far less transferable than the marketing implies.",
      keepDayJobView:
        "Very poor because commercial HVAC plus 24/7 emergency service is not a believable sidecar ownership story from these public facts.",
      quitDayJobView:
        "Only weak to moderate because the maintenance base is promising, but the lack of disclosed earnings makes income-replacement judgment speculative.",
      benchmarkComparison:
        "It stays behind the benchmark because the benchmark is both easier to underwrite and less obviously dependent on one owner's commercial-operating role.",
      confidence:
        "Confidence is intentionally low because the listing withholds the core financials and still shows the owner in a meaningful day-to-day operating seat.",
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
