import {
  buildVercelArgs,
  getMissingEnvironmentVariables,
  getRunnerBinary,
  getVercelCredentialRotationMessage,
  parseVercelWhoAmIOutput,
  runCommandCapture,
} from "./vercel-deploy.lib";

function parseArgs(argv: string[]) {
  let tokenEnvName = "VERCEL_TOKEN";

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--token-env" && argv[index + 1]) {
      tokenEnvName = argv[index + 1];
      index += 1;
    }
  }

  return {
    tokenEnvName,
  };
}

function main() {
  const { tokenEnvName } = parseArgs(process.argv.slice(2));
  const missingEnvironmentVariables = getMissingEnvironmentVariables([
    tokenEnvName,
    "VERCEL_ORG_ID",
    "VERCEL_PROJECT_ID",
  ]);

  if (missingEnvironmentVariables.length > 0) {
    throw new Error(
      `Missing required Vercel deploy environment variables: ${missingEnvironmentVariables.join(", ")}. ${getVercelCredentialRotationMessage(tokenEnvName)}`,
    );
  }

  const token = process.env[tokenEnvName]!.trim();
  const whoAmIOutput = runCommandCapture(
    "Vercel access check",
    getRunnerBinary("npx"),
    buildVercelArgs(["whoami", "--format=json", "--non-interactive"], token),
    {
      env: process.env,
    },
  );

  const username = parseVercelWhoAmIOutput(whoAmIOutput);

  console.log(
    JSON.stringify(
      {
        step: "vercel-access-verified",
        username,
        orgIdConfigured: true,
        projectIdConfigured: true,
        tokenEnvName,
      },
      null,
      2,
    ),
  );
}

try {
  main();
} catch (error) {
  const baseMessage = error instanceof Error ? error.message : String(error);

  console.error(baseMessage);
  process.exitCode = 1;
}
