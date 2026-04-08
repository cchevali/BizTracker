import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  printAcquisitionThesisBackfillSummary,
  runAcquisitionThesisBackfill,
} from "./backfill-acquisition-thesis.lib";

if (!process.env.DATABASE_URL) {
  loadDotenv();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  }),
});

async function main() {
  const summary = await runAcquisitionThesisBackfill(prisma);
  printAcquisitionThesisBackfillSummary(summary);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
