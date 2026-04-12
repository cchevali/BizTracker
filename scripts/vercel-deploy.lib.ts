import { execFileSync, spawnSync, type SpawnSyncOptions } from "node:child_process";

export function getRunnerBinary(binary: "npm" | "npx") {
  return process.platform === "win32" ? `${binary}.cmd` : binary;
}

export function buildVercelArgs(command: string[], token?: string) {
  if (!token) {
    return ["vercel", ...command];
  }

  return ["vercel", ...command, `--token=${token}`];
}

export function normalizeVercelUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

export function parseVercelDeployOutput(rawOutput: string) {
  const parsed = JSON.parse(rawOutput) as { url?: unknown };

  if (typeof parsed.url !== "string" || parsed.url.trim().length === 0) {
    throw new Error("Vercel deploy output did not include a deployment URL.");
  }

  return normalizeVercelUrl(parsed.url.trim());
}

export function parseVercelWhoAmIOutput(rawOutput: string) {
  const parsed = JSON.parse(rawOutput) as {
    username?: unknown;
    user?: {
      username?: unknown;
    };
  };

  if (typeof parsed.username === "string" && parsed.username.length > 0) {
    return parsed.username;
  }

  if (
    typeof parsed.user?.username === "string" &&
    parsed.user.username.length > 0
  ) {
    return parsed.user.username;
  }

  throw new Error("Vercel whoami output did not include a username.");
}

export function runCommand(
  description: string,
  command: string,
  args: string[],
  options?: SpawnSyncOptions,
) {
  execFileSync(command, args, {
    stdio: "inherit",
    ...options,
  });

  console.log(JSON.stringify({ step: description, status: "ok" }, null, 2));
}

export function runCommandCapture(
  description: string,
  command: string,
  args: string[],
  options?: SpawnSyncOptions,
) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderrOutput =
      typeof result.stderr === "string"
        ? result.stderr.trim()
        : result.stderr?.toString("utf8").trim() ?? "";
    const stdoutOutput =
      typeof result.stdout === "string"
        ? result.stdout.trim()
        : result.stdout?.toString("utf8").trim() ?? "";

    throw new Error(
      `${description} failed with exit code ${result.status ?? "unknown"}.\n${stderrOutput || stdoutOutput || "No command output."}`,
    );
  }

  return typeof result.stdout === "string"
    ? result.stdout.trim()
    : result.stdout.toString("utf8").trim();
}

export function getMissingEnvironmentVariables(names: string[]) {
  return names.filter((name) => {
    const value = process.env[name];
    return typeof value !== "string" || value.trim().length === 0;
  });
}

export function getVercelCredentialRotationMessage(tokenEnvName: string) {
  return [
    `Rotate ${tokenEnvName} with a current classic Vercel personal token from https://vercel.com/account/tokens.`,
    "Keep VERCEL_ORG_ID and VERCEL_PROJECT_ID aligned with the microflowops-biztracker project.",
    "The local Vercel OAuth login cannot mint new tokens for GitHub Actions.",
  ].join(" ");
}

export async function sleep(delayMs: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
