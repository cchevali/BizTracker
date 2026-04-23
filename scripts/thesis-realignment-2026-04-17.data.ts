import { DealStatus, PipelineBucket } from "../src/generated/prisma/enums";

export const THESIS_REALIGNMENT_DATE = "2026-04-17";
export const THESIS_REALIGNMENT_NOTE_HEADING = `Thesis realignment (${THESIS_REALIGNMENT_DATE})`;

export type ThesisRealignmentOverride = {
  pipelineBucket?: PipelineBucket;
  dealStatus?: DealStatus;
  overallScore?: number;
  dataConfidenceScore?: number;
  beatsCurrentBenchmark?: boolean;
  benchmarkNotes?: string;
  whyItMayFitAppend?: string;
  risksAppend?: string;
  tagAdditions?: string[];
  noteReason: string;
};

export const promotedBusinessNames = [
  "Established Landscaping, Snow Plowing, Hardscape & Concrete Company",
  "High Income Recession-Proof HVAC Services Business",
  "Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts",
  "Commercial Landscaping Company- $1M+ Revenue and Strong Cash Flow",
] as const;

export const demotedBusinessNames = [
  "Established Secure Document & Specialty Disposal Business – South FL",
  "Profitable Semi-Absentee Air Duct & HVAC Cleaning Biz 30+ Years",
  "19 FedEx Ground Routes, Colorado Springs, CO",
  "20 FedEx Ground Routes, Colorado Springs, CO",
  "23 FedEx Ground Routes - Buffalo, NY - Seller & Vehicle Financing",
  "9 FedEx Ground Routes, Manassas VA",
  "3 FedEx Linehaul Routes - Stafford, VA - Highly Profitable",
  "Northeast Virginia Multi-trade Company",
  "Great South Charlotte pool company with high end clientele",
  "Established/Commercial Landscaping /Hardscaping Business - Central OH",
  "Highly Profitable, Established HVAC Service Provider with Real Estate",
  "Growing Central Ohio Plumbing Business for Sale",
  "$2.0 Million Plumbing Contractor, $350K Net; SBA Pre-Approved! (17923)",
  "Profitable Plumbing & HVAC Business – Hampton Roads",
  "Sewer/Water Line Repair Co, 1.4M Rev, 607K, Net, SP Only 1.6M, Growing",
  "Commercial Cleaning Business with Recurring Revenue!",
  "Money Saving Service Business - Dryer Vent Cleaning - Fairfax",
  "Established Dryer Vent Cleaning Franchise Resale – Washington, DC",
  "Window Cleaning Business with $115k income",
  "Stable Route-Based Business with Long-Term Clients",
  "Established Cleaning Business - Multi-State Commercial Clients",
] as const;

export const movedOutOfDefaultActiveViewBusinessNames = [
  "Anchor Point Bookkeeping Co.",
  "Riverbend Property Inspection Group",
  "AI-Enhanced Aesthetic and Wellness Brand with Strong Client Retention",
  "Healthcare Staffing Agency for Sale, 5+M in Revenue with 60+ staffs",
  "Commercial Real Estate Service",
  "Flowers Bread Route, Fairfax County, Virginia",
  "Pittsburgh, PA - Multi Unit Auto Paint Business",
  "Grand Rapids, MI - Automotive Paint & Dent Repair Multi-Unit Franchise",
  "Colorado Commercial Construction Company for Sale",
  "High-end Residential Remodeling and contracting service",
  "Commercial Tenant Finishing General Contractor: Strong Reputation",
  "Ann Arbor Area Construction Business",
  "Resilient Commercial Trade Contractor with Commercial Focus",
  "Water Well Drilling Company-New lower price",
  "Company w/ High Gross Profits - Property Damage & Restoration",
  "Prairie Fire Equipment Rental",
  "Money Saving Service Business - Dryer Vent Cleaning - Fairfax",
  "Established Dryer Vent Cleaning Franchise Resale – Washington, DC",
  "Window Cleaning Business with $115k income",
  "Stable Route-Based Business with Long-Term Clients",
  "Established Cleaning Business - Multi-State Commercial Clients",
  "Northeast Virginia Multi-trade Company",
  "Established/Commercial Landscaping /Hardscaping Business - Central OH",
] as const;

export const intentionallyUnchangedBusinessNames = [
  "Profitable HVAC Air Quality & Duct Cleaning Business Franchise",
  "Most profitable business",
  "Commercial power washing with reoccurring revenue!",
  "Commercial HVAC Filter Change-Out & Maintenance",
  "Pest Control Management Business",
  "Profitable Pest Control Business: Turnkey & Recession Proof",
  "Profitable Wildlife Removal, Pest Control and Restoration Service",
  "Established Air Duct Cleaning & Indoor Air Quality Business",
  "Established wildlife control business",
  "Turnkey Appliance Repair Biz | Absentee Ownership Possible | SW VA",
  "Coastal Garage Door Service and Sales Company",
  "Profitable Residential Pest Control Company",
  "Commercial Services Business Serving Professional Facilities",
  "Long-Established Commercial Cleaning & Contracting Company (37 Years)",
  "Philadelphia Repair Company: Parking Lot Maintenance",
  "Lucrative, Pool Service Business with 4.9 Stars!",
  "Established Organic Lawn Care & Pest Control – Recurring Revenue",
  "Plumbing and Heating with Nearly $400,000 Cash Flow",
  "Plumbing and Heating Service",
  "Residential HVAC Company - Southeast Michigan",
  "Longstanding Commercial HVAC Business - SBA Pre-Qualified",
  "Desirable Commercial HVAC Co. Serving Maryland, Virginia & DC",
  "Established Commercial HVAC and Refrigeration Service Company",
  "Well Established HVAC Company Serving Southern Maryland",
  "Chimney Cleaning and Repair Service - by Doug Jackson",
] as const;

export const thesisRealignmentOverrides: Record<
  string,
  ThesisRealignmentOverride
> = {
  "Established Landscaping & Snow Removal Company | $500K SDE | 30+ Years": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 89,
    beatsCurrentBenchmark: true,
    benchmarkNotes:
      "One of the best current verified fits for the brother-local / buyer-remote thesis. Wayne combines real cash flow, crew-based field delivery, recurring seasonal contracts, and a lower-cost Midwest operating context that helps it edge out otherwise similar higher-cost outdoor-service platforms.",
    whyItMayFitAppend:
      "Under the current thesis, this is a top-tier verified contender because the economics, crew-based structure, and lower-cost Michigan setting make the brother-local operating model unusually plausible.",
    risksAppend:
      "The main remaining diligence question is whether crew leadership and customer communication already sit below the owner, not whether the basic category or economics fit.",
    tagAdditions: ["top-tier-fit", "brother-local-best-fit"],
    noteReason:
      "Pushed into the top tier because the verified Wayne listing looks like one of the cleanest current brother-local / buyer-remote outdoor-service fits once price, cash flow, and local cost of living are weighed together.",
  },
  "Established Landscaping, Snow Plowing, Hardscape & Concrete Company": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 88,
    beatsCurrentBenchmark: true,
    benchmarkNotes:
      "One of the strongest current verified fits for the brother-local / buyer-remote thesis. It pairs real scale, management depth, and contract infrastructure with better transferability than most field-service listings, though it remains more capital-heavy than the ideal lower-cost-market version of this model.",
    whyItMayFitAppend:
      "Under the current thesis, this is a top-tier verified contender because the management layer and multi-service outdoor mix make delegated local oversight unusually plausible.",
    risksAppend:
      "The main remaining thesis discount is capital intensity rather than operability, especially versus a similar lower-cost-market version of the same model.",
    tagAdditions: ["top-tier-fit", "brother-local-best-fit"],
    noteReason:
      "Kept near the top because the verified public listing still looks like one of the cleanest real management-team outdoor-service platforms in the tracker, even after penalizing for New Jersey cost and equity load.",
  },
  "High Income Recession-Proof HVAC Services Business": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 87,
    beatsCurrentBenchmark: true,
    benchmarkNotes:
      "Promoted into the top tier because the earnings, team size, and credible operating-company shape fit the brother-local / buyer-remote structure better than the old ranking implied.",
    whyItMayFitAppend:
      "It now grades as a top-tier public contender because the economics and team depth are strong enough to support a real operator-plus-remote-owner structure.",
    risksAppend:
      "The remaining drag is technical complexity and franchise/bench depth risk, not a lack of economic substance.",
    tagAdditions: ["top-tier-fit"],
    noteReason:
      "Promoted because the current thesis values real earnings, team depth, and transferability more heavily than the older scoring did.",
  },
  "Premier NJ Residential Pool Service Co. - 37 yrs - Recurring Contracts": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 85,
    beatsCurrentBenchmark: true,
    benchmarkNotes:
      "Kept high because the recurring contract base, long operating history, and service-route shape matter more than state-level geography under the current thesis.",
    whyItMayFitAppend:
      "It stays near the top because recurring service density and multi-decade customer continuity are still valuable for a brother-local operating model.",
    risksAppend:
      "The thesis now penalizes it only where the economics, staffing depth, or seasonality warrant it rather than simply because it is in New Jersey.",
    tagAdditions: ["top-tier-fit"],
    noteReason:
      "Kept high because operability and recurring service structure outweigh the geography penalty under the current thesis.",
  },
  "Established/Commercial Landscaping /Hardscaping Business - Central OH": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.LETTER_OF_INTENT,
    overallScore: 68,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Retained as a sale-pending comp for Wayne/Clifton-style landscaping and snow businesses because the crew depth, commercial mix, and multi-service operating shape are still useful valuation and structure references.",
    whyItMayFitAppend:
      "It is now retained mainly as a sale-pending comparable for larger landscaping and snow businesses rather than as a default active contender.",
    risksAppend:
      "It should not be treated as a live acquisition target because the public page is marked Sale Pending and Under Contract.",
    tagAdditions: ["comp-only", "sale-pending-comp", "valuation-comp"],
    noteReason:
      "Moved to comp-only because the verified public listing is sale pending / under contract and is more useful now as a structure and valuation reference than as a live pipeline target.",
  },
  "Commercial Landscaping Company- $1M+ Revenue and Strong Cash Flow": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 81,
    whyItMayFitAppend:
      "It earns a modest promotion because commercial maintenance density and route-like repeat work are a better brother-local fit than the prior ranking implied.",
    risksAppend:
      "The main caution is still capex and seasonality, but the recurring commercial mix deserves more credit than it had before.",
    tagAdditions: ["promoted-fit"],
    noteReason:
      "Promoted modestly because commercial recurring landscaping is more aligned with the current thesis than the old score suggested.",
  },
  "Scalable Landscaping Platform | 50% Recurring Revenue | Tampa": {
    pipelineBucket: PipelineBucket.ACTIVE,
    overallScore: 79,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Tampa deserves to stay in the serious-active mix because the recurring maintenance base, route-density upside, and 20-person workforce are real, but it still ranks below Wayne and Clifton because the public page is lighter on management depth and post-debt earnings cushion.",
    whyItMayFitAppend:
      "It remains a real active contender because recurring maintenance revenue and route-density potential are materially better than a small owner-led landscaping shop.",
    risksAppend:
      "The current thesis still discounts it relative to Wayne and Clifton because second-layer management depth is less explicit and the earnings cushion is thinner.",
    noteReason:
      "Kept active but below the top tier because the verified Tampa listing is attractive on recurring maintenance and crew scale, yet still under-discloses management depth compared with Wayne and Clifton.",
  },
  "Established Landscape company with 40 years in business and solid Hist": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    overallScore: 84,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Competes on scale and raw SDE, but it does not beat Wayne on ask-to-SDE efficiency, capital burden, or apparent simplicity.",
    noteReason:
      "Stored as comp-only because it is a useful verified landscaping benchmark, but the current thesis does not want larger capital-heavy comparison rows cluttering the default active pipeline.",
  },
  "High-Margin Landscaping Co. with Route Density in Growth Corridor": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.LETTER_OF_INTENT,
    overallScore: 85,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Closest new comp to Wayne on economics, but still pricier on ask-to-SDE and currently sale pending.",
    noteReason:
      "Stored as comp-only because the verified public page is sale pending and is now more useful as a retained Wayne-style comparison than as a live default-pipeline target.",
  },
  "Established Commercial Landscaping — KC Metro — Recurring Contracts": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    overallScore: 83,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Good commercial recurring structure, but Wayne still wins on listed price-to-SDE and likely simplicity.",
    noteReason:
      "Stored as comp-only because it is a strong verified commercial-landscaping benchmark, but the current thesis reserves the default active view for a tighter working set of live contenders.",
  },
  "39-Year Landscaping Business – Loyal Clients & High Profits": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    overallScore: 77,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Valid comp on earnings and longevity, but not as clean a Wayne-style brother-operator fit.",
    noteReason:
      "Stored as comp-only because it is a useful verified national landscaping comparison row, but the owner-active and tree-service mix make it less clean than the core active targets.",
  },
  "Highly Profitable Full-Service Landscaping & Snow Removal Company": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    overallScore: 82,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Huge SDE comp, but Wayne still looks cleaner on entry price, simplicity, and likely transition risk.",
    noteReason:
      "Stored as comp-only because it is a high-end verified landscaping benchmark, but the capital load and under-disclosed management depth make it a better comp than default active contender.",
  },
  "Blue Ridge HVAC Services": {
    pipelineBucket: PipelineBucket.UNVERIFIED,
    overallScore: 82,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "The business may still be interesting, but it should not outrank verified public listings while the only current source is an internal chat link.",
    whyItMayFitAppend:
      "It is retained only as an unverified contender until a real public listing source is attached.",
    risksAppend:
      "The immediate ranking problem is source quality: the current record does not rest on a live public listing URL.",
    tagAdditions: ["source-unverified"],
    noteReason:
      "Moved out of the default active pipeline because the current source is not a real public listing page.",
  },
  "Northshore Commercial Cleaning": {
    pipelineBucket: PipelineBucket.UNVERIFIED,
    overallScore: 68,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    benchmarkNotes:
      "Retained for context, but it should not remain an active contender without a real public source URL.",
    whyItMayFitAppend:
      "It stays in the tracker only as an unverified reference candidate until a real public listing source is attached.",
    risksAppend:
      "The immediate gating issue is source verification, not just operating merit.",
    tagAdditions: ["source-unverified"],
    noteReason:
      "Moved out of the default active pipeline because the current source is an internal chat link rather than a live public listing.",
  },
  "Established Secure Document & Specialty Disposal Business – South FL": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 72,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains worth monitoring, but now as a second-tier watchlist name rather than a top-tier active contender.",
    risksAppend:
      "The current thesis discounts it because the scale and management depth look lighter than the very best brother-local candidates.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted from the top tier because it looks like a worthwhile route business, but not an elite brother-local / buyer-remote fit.",
  },
  "Profitable Semi-Absentee Air Duct & HVAC Cleaning Biz 30+ Years": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 78,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains a real contender, but now as a watchlist name because the capital burden is heavier than the cleanest current fits.",
    risksAppend:
      "The current thesis discounts it mainly on price and equity load, not because the underlying business shape is weak.",
    tagAdditions: ["watchlist", "capital-heavy"],
    noteReason:
      "Demoted slightly because the operating structure is attractive but the purchase price and equity need weaken the fit relative to the top tier.",
  },
  "19 FedEx Ground Routes, Colorado Springs, CO": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 72,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains useful as a watchlist route-business candidate because the manager-run structure is real, even if it no longer deserves top billing.",
    risksAppend:
      "Platform dependence, driver-management volatility, and vehicle economics now weigh more heavily than they did under the older scoring.",
    tagAdditions: ["watchlist", "platform-risk"],
    noteReason:
      "Demoted because the revised rubric penalizes platform dependence, capex exposure, and weaker AI resistance more explicitly.",
  },
  "20 FedEx Ground Routes, Colorado Springs, CO": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 69,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It stays on the watchlist because the economics are real, but it is no longer a clean active contender under the revised thesis.",
    risksAppend:
      "Fleet burden and platform dependence now weigh more heavily than the route density alone.",
    tagAdditions: ["watchlist", "platform-risk"],
    noteReason:
      "Demoted because the combination of truck exposure and FedEx concentration makes it weaker than the cleaner local-operator candidates.",
  },
  "23 FedEx Ground Routes - Buffalo, NY - Seller & Vehicle Financing": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 72,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains a meaningful watchlist route comparison because the manager-and-financing structure is still cleaner than many route packages.",
    risksAppend:
      "The revised thesis still discounts it for platform dependence, fleet risk, and lower AI resistance versus local service operators.",
    tagAdditions: ["watchlist", "platform-risk"],
    noteReason:
      "Demoted because the route structure is good but the revised thesis gives less credit to platform-tied transportation models.",
  },
  "9 FedEx Ground Routes, Manassas VA": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 66,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains worth monitoring, but now only as a watchlist route deal rather than a default active contender.",
    risksAppend:
      "Missing cash flow plus truck exposure make it less compelling under the revised platform-risk penalties.",
    tagAdditions: ["watchlist", "platform-risk"],
    noteReason:
      "Demoted because the manager-in-place story is still useful, but the economics and platform dependence are not strong enough for the main active list.",
  },
  "3 FedEx Linehaul Routes - Stafford, VA - Highly Profitable": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 67,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It stays on the watchlist because the manager-in-place setup is still relevant, but linehaul is not a clean main-pipeline fit.",
    risksAppend:
      "The revised thesis discounts overnight burden, truck exposure, and platform concentration more heavily.",
    tagAdditions: ["watchlist", "platform-risk"],
    noteReason:
      "Demoted because the manager-run angle is real but linehaul still sits outside the cleanest current fit lane.",
  },
  "Northeast Virginia Multi-trade Company": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 59,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is now retained mainly as a comparable for scale and maintenance-agreement density rather than as a current default-pipeline target.",
    risksAppend:
      "The revised thesis discounts it sharply because the price, multi-trade complexity, and likely management-depth requirement push it beyond the current strike zone.",
    tagAdditions: ["comp-only", "capital-heavy"],
    noteReason:
      "Moved to comp-only because it is a serious business but too large and complex for the current brother-local / buyer-remote thesis.",
  },
  "Great South Charlotte pool company with high end clientele": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 55,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a weaker watchlist pool-service candidate rather than a lead active target.",
    risksAppend:
      "The revised thesis penalizes it for weak economics relative to asking price.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted materially because the economics do not justify a high ranking under the current thesis.",
  },
  "Highly Profitable, Established HVAC Service Provider with Real Estate": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 58,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains watchable, but not as a core active contender under the current thesis.",
    risksAppend:
      "Price, complexity, and real-estate-heavy deal shape weaken the fit relative to cleaner team-run service businesses.",
    tagAdditions: ["watchlist", "capital-heavy"],
    noteReason:
      "Demoted materially because the price and complexity now outweigh the headline category fit.",
  },
  "Growing Central Ohio Plumbing Business for Sale": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 62,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It stays on the board only as a watchlist plumbing candidate rather than a main active fit.",
    risksAppend:
      "The current thesis discounts it for plumbing-license dependence and the likelihood that key technical leadership still matters too much.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted because plumbing-license and key-person risk cap the fit even though the company is still worth monitoring.",
  },
  "$2.0 Million Plumbing Contractor, $350K Net; SBA Pre-Approved! (17923)": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 64,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains a workable watchlist candidate because the bench looks better than most small plumbing listings, but it is no longer a top-pipeline fit.",
    risksAppend:
      "The revised thesis still discounts it for licensed-bench concentration and the possibility that the semi-absentee angle overstates transferability.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted because it looks better than many plumbing deals, but still not like a top-tier brother-local fit.",
  },
  "Profitable Plumbing & HVAC Business – Hampton Roads": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 61,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained as a watchlist name because the earnings are real, but the company no longer clears the bar for the default active view.",
    risksAppend:
      "The revised thesis discounts mixed-trade complexity, emergency-service burden, and under-disclosed management depth.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted because the operating complexity and missing org-chart detail are too heavy for a clean default-pipeline ranking.",
  },
  "Sewer/Water Line Repair Co, 1.4M Rev, 607K, Net, SP Only 1.6M, Growing": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 67,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains a real watchlist contender because the economics are meaningful, but it is no longer scored like a clean remote-owner fit.",
    risksAppend:
      "The revised thesis discounts emergency intensity, field-execution dependence, and likely foreman concentration more heavily.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted moderately because the business is economically real but operationally rougher than the cleaner current fits.",
  },
  "Commercial Cleaning Business with Recurring Revenue!": {
    pipelineBucket: PipelineBucket.WATCHLIST,
    overallScore: 67,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It remains useful as a watchlist janitorial candidate because the recurring revenue is real, but it is no longer a top active fit.",
    risksAppend:
      "The revised thesis discounts labor-management complexity and lower management-depth confidence more heavily.",
    tagAdditions: ["watchlist"],
    noteReason:
      "Demoted slightly because the recurring revenue is attractive but the business does not look as clean as the best current contenders.",
  },
  "Money Saving Service Business - Dryer Vent Cleaning - Fairfax": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 50,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is now retained mainly as a lower-capital benchmark comp rather than as a current active contender.",
    risksAppend:
      "The revised thesis discounts it because the scale is too small to matter under current goals.",
    tagAdditions: ["comp-only", "small-scale"],
    noteReason:
      "Moved to comp-only because it is useful as a low-capital reference point but too small for the current thesis.",
  },
  "Established Dryer Vent Cleaning Franchise Resale – Washington, DC": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 50,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained mainly as a comparable for low-capital service franchises rather than as a current core contender.",
    risksAppend:
      "The revised thesis discounts it because the scale and earnings cushion are too limited.",
    tagAdditions: ["comp-only", "small-scale"],
    noteReason:
      "Moved to comp-only because it is too small and franchise-shaped for the current thesis, but still useful as a comp.",
  },
  "Window Cleaning Business with $115k income": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 48,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is now retained mainly as a small-service comparison point, not as a current active target.",
    risksAppend:
      "The revised thesis discounts it because the post-debt earnings cushion is too thin.",
    tagAdditions: ["comp-only", "small-scale"],
    noteReason:
      "Moved to comp-only because the economics are too weak for the current acquisition goals.",
  },
  "Stable Route-Based Business with Long-Term Clients": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 43,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a low-confidence route comp rather than as a current contender.",
    risksAppend:
      "The location inconsistency and thin cash flow make it too weak for the active pipeline.",
    tagAdditions: ["comp-only", "low-confidence"],
    noteReason:
      "Moved to comp-only because the listing quality is weak and the economics are too small for the current thesis.",
  },
  "Established Cleaning Business - Multi-State Commercial Clients": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 55,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is now retained mainly as a comp for multi-site cleaning businesses rather than as a current core target.",
    risksAppend:
      "The revised thesis discounts multi-state coordination complexity and thinner economics.",
    tagAdditions: ["comp-only"],
    noteReason:
      "Moved to comp-only because it remains useful context but is not strong enough to stay near the main pipeline.",
  },
  "Anchor Point Bookkeeping Co.": {
    pipelineBucket: PipelineBucket.UNVERIFIED,
    dealStatus: DealStatus.PASSED,
    overallScore: 36,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as unverified historical context rather than as a current contender.",
    risksAppend:
      "The current thesis discounts both source quality and category fit here.",
    tagAdditions: ["source-unverified", "off-thesis-comp"],
    noteReason:
      "Moved out of the default active view because it is both off-thesis and sourced from an internal chat link rather than a public listing.",
  },
  "Riverbend Property Inspection Group": {
    pipelineBucket: PipelineBucket.UNVERIFIED,
    dealStatus: DealStatus.PASSED,
    overallScore: 34,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as unverified reference context rather than as a current contender.",
    risksAppend:
      "The current thesis discounts both source quality and referral-channel fragility here.",
    tagAdditions: ["source-unverified", "off-thesis-comp"],
    noteReason:
      "Moved out of the default active view because it is both off-thesis and sourced from an internal chat link rather than a public listing.",
  },
  "AI-Enhanced Aesthetic and Wellness Brand with Strong Client Retention": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 38,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is now retained only as a sector-reference comp rather than as a current brother-local candidate.",
    risksAppend:
      "The revised thesis discounts trend sensitivity, newer-brand risk, and weaker physical-service alignment.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is economically interesting but materially off-thesis for the current operating model.",
  },
  "Healthcare Staffing Agency for Sale, 5+M in Revenue with 60+ staffs": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 26,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a staffing-market comp rather than as a current acquisition target.",
    risksAppend:
      "The revised thesis discounts platform-like staffing exposure, compliance intensity, and off-thesis operating complexity.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because staffing is too far outside the current brother-local / buyer-remote thesis.",
  },
  "Commercial Real Estate Service": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 30,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a commercial-services comp rather than as a current operating fit.",
    risksAppend:
      "The revised thesis discounts platform-advisory exposure and weak local-operator alignment.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is off-thesis for the current physical-service operating model.",
  },
  "Flowers Bread Route, Fairfax County, Virginia": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 41,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained mainly as a route-business benchmark comp rather than as a current active target.",
    risksAppend:
      "The revised thesis discounts owner-labor intensity and platform-like route dependence here.",
    tagAdditions: ["comp-only", "route-comp"],
    noteReason:
      "Moved to comp-only because it is still useful as a route benchmark but no longer belongs in the main active pipeline.",
  },
  "Pittsburgh, PA - Multi Unit Auto Paint Business": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 32,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as an auto-services comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts category fit, multi-unit complexity, and weaker transferability to the current operating model.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is off-thesis but still useful for market comparison.",
  },
  "Grand Rapids, MI - Automotive Paint & Dent Repair Multi-Unit Franchise": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 34,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as an auto-franchise comp rather than as a current acquisition target.",
    risksAppend:
      "The revised thesis discounts category fit and franchise-shaped multi-unit complexity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is off-thesis for the current local-operator model.",
  },
  "Colorado Commercial Construction Company for Sale": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 31,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a construction-market comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts project complexity, backlog risk, and management intensity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is too construction-heavy for the current thesis.",
  },
  "High-end Residential Remodeling and contracting service": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 30,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a remodeling-market comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts project-management intensity, customer-relationship concentration, and off-thesis complexity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because residential remodeling is too owner-and-project heavy for the current thesis.",
  },
  "Commercial Tenant Finishing General Contractor: Strong Reputation": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 29,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a general-contractor comp rather than as a current acquisition target.",
    risksAppend:
      "The revised thesis discounts construction backlog, estimating dependence, and operating complexity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because tenant-finishing GC work is too complex for the current target model.",
  },
  "Ann Arbor Area Construction Business": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 34,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a construction-market comp rather than as a current acquisition target.",
    risksAppend:
      "The revised thesis discounts project-driven construction risk and owner-estimating dependence here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is too construction-heavy for the current thesis.",
  },
  "Resilient Commercial Trade Contractor with Commercial Focus": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 35,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a commercial-trades comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts commercial project complexity and management intensity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is economically real but still too construction-like for the current thesis.",
  },
  "Water Well Drilling Company-New lower price": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 37,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a heavy-industrial comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts heavy equipment, credential dependence, and capex exposure here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because the business is too heavy and capital-intensive for the current thesis.",
  },
  "Company w/ High Gross Profits - Property Damage & Restoration": {
    pipelineBucket: PipelineBucket.COMP_ONLY,
    dealStatus: DealStatus.PASSED,
    overallScore: 41,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as a restoration-market anomaly comp rather than as a current target.",
    risksAppend:
      "The revised thesis discounts listing-quality concerns and restoration-category complexity here.",
    tagAdditions: ["comp-only", "off-thesis-comp"],
    noteReason:
      "Moved to comp-only because it is more useful as a comp/anomaly record than as a current active candidate.",
  },
  "Prairie Fire Equipment Rental": {
    pipelineBucket: PipelineBucket.UNVERIFIED,
    dealStatus: DealStatus.PASSED,
    overallScore: 35,
    dataConfidenceScore: 2,
    beatsCurrentBenchmark: false,
    whyItMayFitAppend:
      "It is retained only as unverified historical context rather than as a current contender.",
    risksAppend:
      "The current thesis discounts both source quality and off-thesis equipment-rental exposure here.",
    tagAdditions: ["source-unverified", "off-thesis-comp"],
    noteReason:
      "Moved out of the default active view because it is both off-thesis and sourced from an internal chat link rather than a public listing.",
  },
};
