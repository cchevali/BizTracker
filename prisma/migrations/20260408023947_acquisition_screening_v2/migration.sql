-- CreateEnum
CREATE TYPE "PrimaryUseCase" AS ENUM ('bridge_while_employed', 'full_time_replacement', 'either', 'neither');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "afterHoursBurden" INTEGER,
ADD COLUMN     "aiResistanceScore" INTEGER,
ADD COLUMN     "beatsCurrentBenchmark" BOOLEAN,
ADD COLUMN     "benchmarkNotes" TEXT,
ADD COLUMN     "capexRisk" INTEGER,
ADD COLUMN     "cashToCloseNotes" TEXT,
ADD COLUMN     "dataConfidenceScore" INTEGER,
ADD COLUMN     "financeabilityRating" INTEGER,
ADD COLUMN     "freshnessVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "homeBasedFlag" BOOLEAN,
ADD COLUMN     "keepDayJobFit" INTEGER,
ADD COLUMN     "keyPersonRisk" INTEGER,
ADD COLUMN     "licenseDependency" INTEGER,
ADD COLUMN     "operatorSkillDependency" INTEGER,
ADD COLUMN     "opsManagerExists" BOOLEAN,
ADD COLUMN     "ownerHoursClaimed" INTEGER,
ADD COLUMN     "primaryUseCase" "PrimaryUseCase",
ADD COLUMN     "quitDayJobFit" INTEGER,
ADD COLUMN     "recurringRevenuePercent" DECIMAL(5,2),
ADD COLUMN     "regretIfWrongScore" INTEGER,
ADD COLUMN     "sellerFinancingAvailable" BOOLEAN,
ADD COLUMN     "sellerFinancingNotes" TEXT,
ADD COLUMN     "staleListingRisk" INTEGER;
