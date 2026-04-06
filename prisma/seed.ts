import { PrismaPg } from "@prisma/adapter-pg";

import { DealStatus, HistoryEventType } from "../src/generated/prisma/enums";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  }),
});

const businesses = [
  {
    businessName: "Blue Ridge HVAC Services",
    sourceUrl: "https://chat.openai.com/c/blue-ridge-hvac-deal",
    category: "Home Services",
    subcategory: "HVAC",
    location: "Greenville, SC",
    stateCode: "SC",
    askingPrice: 1450000,
    revenue: 2310000,
    sde: 412000,
    ebitda: 318000,
    employees: 14,
    summary:
      "Residential HVAC replacement and maintenance business with a steady installer bench, 38% service agreement attachment, and a long history in the Upstate market.",
    whyItMayFit:
      "Recurring maintenance revenue, dispatch-based operations, and clear room to improve marketing and after-hours routing make this a strong operator-led platform.",
    risks:
      "Lead technician concentration is high, the business still relies on owner review for large quotes, and seasonality can create cash-flow pressure in shoulder months.",
    brokerName: "Megan Holt",
    brokerFirm: "Southern Main Street Advisors",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.RESEARCHING,
    ownerDependenceRating: 2,
    recurringRevenueRating: 4,
    transferabilityRating: 4,
    scheduleControlFitRating: 5,
    brotherOperatorFitRating: 4,
    overallScore: 84,
    notes:
      "Would want to diligence service agreement churn, installer retention, and any deferred truck capex in the first pass.",
    tags: ["hvac", "recurring", "home-services", "southeast"],
    noteEntries: [
      {
        body: "Broker packet says the owner has already hired a dispatcher and is off the trucks full time.",
      },
      {
        body: "Customer mix is mostly homeowner direct with some light property-management work.",
      },
    ],
  },
  {
    businessName: "Anchor Point Bookkeeping Co.",
    sourceUrl: "https://chat.openai.com/c/anchor-point-bookkeeping-review",
    category: "Professional Services",
    subcategory: "Bookkeeping",
    location: "Tampa, FL",
    stateCode: "FL",
    askingPrice: 860000,
    revenue: 640000,
    sde: 248000,
    ebitda: 214000,
    employees: 6,
    summary:
      "Subscription-heavy bookkeeping and controller-light services firm serving 110 small businesses on monthly retainers with low client concentration.",
    whyItMayFit:
      "Excellent recurring revenue profile, strong remote-service model, and manageable staffing footprint align well with a process-oriented operator.",
    risks:
      "CPA referral channel concentration is meaningful, customer switching costs are moderate, and workflow documentation needs cleanup before a transition.",
    brokerName: "Jon Velasquez",
    brokerFirm: "Gulf Coast M&A",
    listingSource: "Quiet Light-style referral",
    dealStatus: DealStatus.WATCHLIST,
    ownerDependenceRating: 3,
    recurringRevenueRating: 5,
    transferabilityRating: 4,
    scheduleControlFitRating: 5,
    brotherOperatorFitRating: 3,
    overallScore: 82,
    notes:
      "Could be a strong cash-flow business but may need a stronger client-success lead early in ownership.",
    tags: ["b2b", "bookkeeping", "subscription", "remote-friendly"],
    noteEntries: [
      {
        body: "Net revenue retention is reportedly above 100% because clients add payroll and cleanup work over time.",
      },
    ],
  },
  {
    businessName: "Northshore Commercial Cleaning",
    sourceUrl: "https://chat.openai.com/c/northshore-cleaning-notes",
    category: "Facility Services",
    subcategory: "Commercial Cleaning",
    location: "Cleveland, OH",
    stateCode: "OH",
    askingPrice: 1125000,
    revenue: 1780000,
    sde: 332000,
    ebitda: 279000,
    employees: 28,
    summary:
      "Regional janitorial company focused on medical offices, light industrial sites, and church facilities under multiyear service agreements.",
    whyItMayFit:
      "Predictable route density, contract-based revenue, and straightforward KPI management create a business that can be run with disciplined field oversight.",
    risks:
      "Labor turnover is persistent, account margins vary by contract vintage, and the owner still covers some key account escalations personally.",
    brokerName: "Tara Singh",
    brokerFirm: "Lakefront Business Brokers",
    listingSource: "BizQuest",
    dealStatus: DealStatus.CONTACTED_BROKER,
    ownerDependenceRating: 3,
    recurringRevenueRating: 5,
    transferabilityRating: 4,
    scheduleControlFitRating: 4,
    brotherOperatorFitRating: 5,
    overallScore: 80,
    notes:
      "Worth checking whether margin compression from wage inflation has fully flowed through to customer pricing yet.",
    tags: ["cleaning", "routes", "b2b", "recurring"],
    noteEntries: [
      {
        body: "Customer concentration looks acceptable; largest account is just under 11% of annual revenue.",
      },
    ],
  },
  {
    businessName: "Prairie Fire Equipment Rental",
    sourceUrl: "https://chat.openai.com/c/prairie-fire-equipment-rental",
    category: "Industrial Services",
    subcategory: "Equipment Rental",
    location: "Wichita, KS",
    stateCode: "KS",
    askingPrice: 2675000,
    revenue: 3490000,
    sde: 618000,
    ebitda: 521000,
    employees: 11,
    summary:
      "Specialty equipment rental provider serving contractors, municipalities, and industrial clients with a niche mix of pumps, lifts, and trench safety inventory.",
    whyItMayFit:
      "Asset utilization can be measured cleanly, pricing power is better than generic rental, and demand is tied to routine infrastructure and maintenance spend.",
    risks:
      "Fleet age and replacement timing matter, capex requirements are meaningful, and a few top customers book on handshake relationships today.",
    brokerName: "Scott Ramirez",
    brokerFirm: "Heartland Capital Transfer",
    listingSource: "Direct broker outreach",
    dealStatus: DealStatus.UNDER_REVIEW,
    ownerDependenceRating: 3,
    recurringRevenueRating: 3,
    transferabilityRating: 4,
    scheduleControlFitRating: 4,
    brotherOperatorFitRating: 4,
    overallScore: 77,
    notes:
      "The scale is attractive, but this one needs careful fixed-asset diligence and a realistic post-close capex plan.",
    tags: ["equipment-rental", "industrial", "fleet", "midwest"],
    noteEntries: [
      {
        body: "Would want a 24-month utilization report by asset class before moving deeper.",
      },
    ],
  },
  {
    businessName: "Maple Lane Pediatric Therapy",
    sourceUrl: "https://chat.openai.com/c/maple-lane-pediatric-therapy",
    category: "Healthcare Services",
    subcategory: "Pediatric Therapy",
    location: "Raleigh, NC",
    stateCode: "NC",
    askingPrice: 1950000,
    revenue: 2140000,
    sde: 401000,
    ebitda: 347000,
    employees: 18,
    summary:
      "Occupational, speech, and physical therapy practice with a mix of private pay and insurer reimbursements plus a growing homeschool population niche.",
    whyItMayFit:
      "Strong mission alignment, referral depth, and resilient demand make it attractive if compliance and clinician retention check out.",
    risks:
      "Credentialing complexity is higher, therapist recruiting is competitive, and insurance reimbursement changes could hit margins quickly.",
    brokerName: "Alicia Boone",
    brokerFirm: "Carolina Healthcare Advisors",
    listingSource: "Private referral",
    dealStatus: DealStatus.PASSED,
    ownerDependenceRating: 2,
    recurringRevenueRating: 4,
    transferabilityRating: 2,
    scheduleControlFitRating: 2,
    brotherOperatorFitRating: 2,
    overallScore: 58,
    notes:
      "Quality business, but the licensing/compliance profile probably pushes it outside the current comfort zone.",
    tags: ["healthcare", "therapy", "compliance-heavy"],
    noteEntries: [
      {
        body: "Marked as passed because regulation and clinician recruiting feel too specialized for the first acquisition.",
      },
    ],
  },
  {
    businessName: "Riverbend Property Inspection Group",
    sourceUrl: "https://chat.openai.com/c/riverbend-property-inspection",
    category: "Real Estate Services",
    subcategory: "Inspection",
    location: "Nashville, TN",
    stateCode: "TN",
    askingPrice: 635000,
    revenue: 590000,
    sde: 221000,
    ebitda: 198000,
    employees: 5,
    summary:
      "Residential inspection company with strong agent relationships, bundled sewer scopes, and ancillary revenue from radon and mold testing.",
    whyItMayFit:
      "Lean team, low capex, and clear dispatch/reporting workflows make this one easier to learn and potentially bolt onto adjacent services later.",
    risks:
      "Referral concentration around a handful of real estate teams is meaningful, and housing transaction volume can soften quickly in rate-driven slowdowns.",
    brokerName: "Rebecca Flynn",
    brokerFirm: "Volunteer State Business Sales",
    listingSource: "BizBuySell",
    dealStatus: DealStatus.NEW,
    ownerDependenceRating: 3,
    recurringRevenueRating: 2,
    transferabilityRating: 4,
    scheduleControlFitRating: 4,
    brotherOperatorFitRating: 5,
    overallScore: 74,
    notes:
      "This could be an approachable first deal if referral durability checks out and reporting software is well documented.",
    tags: ["inspection", "low-capex", "home-services"],
    noteEntries: [
      {
        body: "Potentially interesting as a lower-priced entry point with room for cross-sell services.",
      },
    ],
  },
] as const;

const filterPresets = [
  {
    name: "Recurring Revenue Focus",
    query: {
      sort: "score",
      tags: "recurring,subscription",
      view: "cards",
    },
  },
  {
    name: "Home Services Under $1.5M",
    query: {
      category: "Home Services",
      maxAsk: "1500000",
      sort: "updated",
      view: "table",
    },
  },
  {
    name: "High SDE Pipeline",
    query: {
      minSde: "300000",
      sort: "sde",
      view: "table",
    },
  },
] as const;

async function main() {
  await prisma.businessHistoryEvent.deleteMany();
  await prisma.businessNote.deleteMany();
  await prisma.filterPreset.deleteMany();
  await prisma.business.deleteMany();

  for (const business of businesses) {
    const created = await prisma.business.create({
      data: {
        businessName: business.businessName,
        sourceUrl: business.sourceUrl,
        category: business.category,
        subcategory: business.subcategory,
        location: business.location,
        stateCode: business.stateCode,
        askingPrice: business.askingPrice,
        revenue: business.revenue,
        sde: business.sde,
        ebitda: business.ebitda,
        employees: business.employees,
        summary: business.summary,
        whyItMayFit: business.whyItMayFit,
        risks: business.risks,
        brokerName: business.brokerName,
        brokerFirm: business.brokerFirm,
        listingSource: business.listingSource,
        dealStatus: business.dealStatus,
        ownerDependenceRating: business.ownerDependenceRating,
        recurringRevenueRating: business.recurringRevenueRating,
        transferabilityRating: business.transferabilityRating,
        scheduleControlFitRating: business.scheduleControlFitRating,
        brotherOperatorFitRating: business.brotherOperatorFitRating,
        overallScore: business.overallScore,
        notes: business.notes,
        tags: [...business.tags],
        noteEntries: {
          create: business.noteEntries.map((note) => ({
            body: note.body,
          })),
        },
        historyEvents: {
          create: [
            {
              eventType: HistoryEventType.CREATED,
              description: "Seeded business record created.",
            },
            {
              eventType: HistoryEventType.STATUS_CHANGED,
              description: `Initial seeded status set to ${business.dealStatus.replaceAll("_", " ").toLowerCase()}.`,
              metadata: {
                to: business.dealStatus,
              },
            },
          ],
        },
      },
    });

    await prisma.businessHistoryEvent.createMany({
      data: business.noteEntries.map((note) => ({
        businessId: created.id,
        eventType: HistoryEventType.NOTE_ADDED,
        description: note.body.slice(0, 110),
      })),
    });
  }

  for (const preset of filterPresets) {
    await prisma.filterPreset.create({
      data: {
        name: preset.name,
        query: preset.query,
      },
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
