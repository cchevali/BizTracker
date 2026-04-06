-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('NEW', 'WATCHLIST', 'RESEARCHING', 'CONTACTED_BROKER', 'UNDER_REVIEW', 'LETTER_OF_INTENT', 'PASSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "HistoryEventType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'NOTE_ADDED');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "location" TEXT NOT NULL,
    "stateCode" TEXT,
    "askingPrice" DECIMAL(14,2),
    "revenue" DECIMAL(14,2),
    "sde" DECIMAL(14,2),
    "ebitda" DECIMAL(14,2),
    "employees" INTEGER,
    "summary" TEXT NOT NULL,
    "whyItMayFit" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "brokerName" TEXT,
    "brokerFirm" TEXT,
    "listingSource" TEXT,
    "dealStatus" "DealStatus" NOT NULL DEFAULT 'NEW',
    "ownerDependenceRating" INTEGER,
    "recurringRevenueRating" INTEGER,
    "transferabilityRating" INTEGER,
    "scheduleControlFitRating" INTEGER,
    "brotherOperatorFitRating" INTEGER,
    "overallScore" INTEGER,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessNote" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHistoryEvent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "eventType" "HistoryEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessHistoryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilterPreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Business_businessName_idx" ON "Business"("businessName");

-- CreateIndex
CREATE INDEX "Business_category_idx" ON "Business"("category");

-- CreateIndex
CREATE INDEX "Business_stateCode_idx" ON "Business"("stateCode");

-- CreateIndex
CREATE INDEX "Business_dealStatus_idx" ON "Business"("dealStatus");

-- CreateIndex
CREATE INDEX "Business_askingPrice_idx" ON "Business"("askingPrice");

-- CreateIndex
CREATE INDEX "Business_sde_idx" ON "Business"("sde");

-- CreateIndex
CREATE INDEX "Business_overallScore_idx" ON "Business"("overallScore");

-- CreateIndex
CREATE INDEX "Business_createdAt_idx" ON "Business"("createdAt");

-- CreateIndex
CREATE INDEX "Business_updatedAt_idx" ON "Business"("updatedAt");

-- CreateIndex
CREATE INDEX "BusinessNote_businessId_createdAt_idx" ON "BusinessNote"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "BusinessHistoryEvent_businessId_createdAt_idx" ON "BusinessHistoryEvent"("businessId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FilterPreset_name_key" ON "FilterPreset"("name");

-- CreateIndex
CREATE INDEX "FilterPreset_updatedAt_idx" ON "FilterPreset"("updatedAt");

-- AddForeignKey
ALTER TABLE "BusinessNote" ADD CONSTRAINT "BusinessNote_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHistoryEvent" ADD CONSTRAINT "BusinessHistoryEvent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
