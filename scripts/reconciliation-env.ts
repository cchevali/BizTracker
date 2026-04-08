import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse as parseDotenv } from "dotenv";

export type ReconciliationTarget = "local" | "production";

export type DatabaseTargetSummary = {
  envFile: string;
  host: string;
  port: string | null;
  database: string;
  user: string;
  sslmode: string | null;
  channelBinding: string | null;
};

function stripWrappingQuotes(value: string) {
  if (
    value.length >= 2 &&
    value.startsWith('"') &&
    value.endsWith('"')
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function resolveEnvFile(target: ReconciliationTarget, explicitEnvFile?: string) {
  if (explicitEnvFile) {
    return path.resolve(explicitEnvFile);
  }

  if (target === "production") {
    return path.resolve(".vercel/.env.production.local");
  }

  return path.resolve(".env");
}

export function loadEnvironmentFromFile(
  target: ReconciliationTarget,
  explicitEnvFile?: string,
) {
  const envFile = resolveEnvFile(target, explicitEnvFile);

  if (!existsSync(envFile)) {
    throw new Error(
      `Environment file not found at ${envFile}. ${
        target === "production"
          ? "Run `npx vercel pull --yes --environment=production` first."
          : ""
      }`.trim(),
    );
  }

  const parsed = parseDotenv(readFileSync(envFile, "utf8"));

  for (const [key, value] of Object.entries(parsed)) {
    process.env[key] = stripWrappingQuotes(value);
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is missing from ${envFile}.`);
  }

  return {
    databaseUrl,
    summary: getDatabaseTargetSummary(databaseUrl, envFile),
  };
}

export function getDatabaseTargetSummary(
  databaseUrl: string,
  envFile: string,
): DatabaseTargetSummary {
  const url = new URL(databaseUrl);

  return {
    envFile,
    host: url.hostname,
    port: url.port || null,
    database: url.pathname.replace(/^\//, ""),
    user: url.username,
    sslmode: url.searchParams.get("sslmode"),
    channelBinding: url.searchParams.get("channel_binding"),
  };
}

export function assertProductionTarget(summary: DatabaseTargetSummary) {
  const expectedEnvFile = path.resolve(".vercel/.env.production.local");

  if (summary.envFile !== expectedEnvFile) {
    throw new Error(
      `Refusing production reconciliation because env file ${summary.envFile} does not match ${expectedEnvFile}.`,
    );
  }

  const projectFile = path.resolve(".vercel/project.json");

  if (!existsSync(projectFile)) {
    throw new Error(
      `Refusing production reconciliation because ${projectFile} is missing. Run \`npx vercel pull --yes --environment=production\` first.`,
    );
  }

  const project = JSON.parse(readFileSync(projectFile, "utf8")) as {
    projectName?: string;
  };

  if (project.projectName !== "microflowops-biztracker") {
    throw new Error(
      `Refusing production reconciliation because linked Vercel project is ${project.projectName ?? "unknown"}, not microflowops-biztracker.`,
    );
  }

  if (summary.host === "localhost" || summary.host === "127.0.0.1") {
    throw new Error(
      `Refusing production reconciliation because DATABASE_URL resolves to local host ${summary.host}.`,
    );
  }
}
