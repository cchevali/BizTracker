import { pathToFileURL } from "node:url";

import {
  assertProductionTarget,
  loadEnvironmentFromFile,
} from "./reconciliation-env";
import { verifyBizTrackerReconciliation } from "./verify-biztracker-reconciliation";
import {
  buildVercelArgs,
  getRunnerBinary,
  parseVercelDeployOutput,
  runCommand,
  runCommandCapture,
  sleep,
} from "./vercel-deploy.lib";

const STANDALONE_ALIAS_URL = "https://microflowops-biztracker.vercel.app";
const PUBLIC_BASE_URL = "https://microflowops.com";

type SmokeCheckTarget = {
  label: string;
  url: string;
  expectedContentDisposition?: string;
};

function resolveOptionalToken() {
  const value = process.env.VERCEL_TOKEN;

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  return value.trim();
}

function parseArgs(argv: string[]) {
  let skipSmokeChecks = false;

  for (const value of argv) {
    if (value === "--skip-smoke-checks") {
      skipSmokeChecks = true;
    }
  }

  return {
    skipSmokeChecks,
  };
}

function getSmokeCheckTargets(deploymentUrl: string): SmokeCheckTarget[] {
  return [
    {
      label: "Deployment URL",
      url: `${deploymentUrl}/biztracker`,
    },
    {
      label: "Standalone alias",
      url: `${STANDALONE_ALIAS_URL}/biztracker`,
    },
    {
      label: "Public app",
      url: `${PUBLIC_BASE_URL}/biztracker`,
    },
    {
      label: "Public workbook export",
      url: `${PUBLIC_BASE_URL}/biztracker/exports/businesses`,
      expectedContentDisposition: ".xlsx",
    },
  ];
}

async function runSmokeCheck(target: SmokeCheckTarget) {
  const response = await fetch(target.url, {
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(
      `${target.label} smoke check failed with HTTP ${response.status} for ${target.url}.`,
    );
  }

  if (target.expectedContentDisposition) {
    const contentDisposition = response.headers.get("content-disposition");

    if (
      !contentDisposition ||
      !contentDisposition.includes(target.expectedContentDisposition)
    ) {
      throw new Error(
        `${target.label} smoke check expected content-disposition to include ${target.expectedContentDisposition}, received ${contentDisposition ?? "none"}.`,
      );
    }
  }

  await response.body?.cancel();

  return {
    label: target.label,
    status: response.status,
    url: target.url,
  };
}

async function runSmokeChecks(deploymentUrl: string) {
  const results: Array<{
    label: string;
    status: number;
    url: string;
  }> = [];

  for (const target of getSmokeCheckTargets(deploymentUrl)) {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        results.push(await runSmokeCheck(target));
        lastError = null;
        break;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error(String(error));

        if (attempt === 5) {
          break;
        }

        console.log(
          `Smoke check retry ${attempt} for ${target.label} failed. Waiting 5 seconds before retrying...`,
        );
        await sleep(5_000);
      }
    }

    if (lastError) {
      throw lastError;
    }
  }

  return results;
}

async function pullProductionEnvironment(token?: string) {
  const args = buildVercelArgs(
    ["pull", "--yes", "--environment=production", "--non-interactive"],
    token,
  );

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      runCommand(
        "vercel-pull-production",
        getRunnerBinary("npx"),
        args,
        {
          env: process.env,
        },
      );

      return;
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }

      console.log(
        `Vercel production pull failed on attempt ${attempt}. Waiting 15 seconds before retrying...`,
      );
      await sleep(15_000);
    }
  }
}

async function main() {
  const { skipSmokeChecks } = parseArgs(process.argv.slice(2));
  const token = resolveOptionalToken();

  await pullProductionEnvironment(token);

  const { databaseUrl, summary: databaseTarget } = loadEnvironmentFromFile(
    "production",
  );
  assertProductionTarget(databaseTarget);

  console.log(
    JSON.stringify(
      {
        step: "production-target-confirmed",
        databaseTarget,
      },
      null,
      2,
    ),
  );

  process.env.DATABASE_URL = databaseUrl;

  runCommand(
    "prisma-migrate-deploy",
    getRunnerBinary("npx"),
    ["prisma", "migrate", "deploy"],
    {
      env: process.env,
    },
  );

  const verificationResult = await verifyBizTrackerReconciliation({
    databaseUrl,
  });

  console.log(JSON.stringify(verificationResult.summary, null, 2));

  if (verificationResult.failures.length > 0) {
    throw new Error(
      `Production verification failed before deploy:\n${verificationResult.failures.join("\n")}`,
    );
  }

  const deployOutput = runCommandCapture(
    "vercel-production-deploy",
    getRunnerBinary("npx"),
    buildVercelArgs(
      [
        "deploy",
        "--prod",
        "--yes",
        "--format=json",
        "--non-interactive",
      ],
      token,
    ),
    {
      env: process.env,
    },
  );
  const deploymentUrl = parseVercelDeployOutput(deployOutput);

  const smokeChecks = skipSmokeChecks
    ? []
    : await runSmokeChecks(deploymentUrl);

  console.log(
    JSON.stringify(
      {
        step: "manual-production-deploy-complete",
        deploymentUrl,
        smokeChecks,
      },
      null,
      2,
    ),
  );
}

const isDirectExecution = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
