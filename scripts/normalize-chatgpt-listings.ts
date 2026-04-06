import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  normalizeChatGptBusinessListings,
} from "../src/features/businesses/domain/business-import-normalizer";

function getDefaultOutputPath(inputPath: string) {
  const parsed = path.parse(inputPath);
  return path.join(parsed.dir, `${parsed.name}.normalized${parsed.ext || ".json"}`);
}

async function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] ?? (inputPath ? getDefaultOutputPath(inputPath) : "");

  if (!inputPath) {
    console.error(
      "Usage: npm run normalize:listings -- <input-json-path> [output-json-path]",
    );
    process.exitCode = 1;
    return;
  }

  const raw = await readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Expected the input JSON to be an array of business objects.");
  }

  const normalized = normalizeChatGptBusinessListings(parsed as Record<string, unknown>[]);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(`${outputPath}`, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  const normalizedScores = normalized.filter(
    (listing) => listing.overallScore !== null,
  ).length;

  console.log(`Normalized ${normalized.length} listings.`);
  console.log(`Output: ${outputPath}`);
  console.log(`Listings with overall scores: ${normalizedScores}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
