import { describe, expect, it } from "vitest";

import {
  getVercelCredentialRotationMessage,
  normalizeVercelUrl,
  parseVercelDeployOutput,
  parseVercelWhoAmIOutput,
} from "../scripts/vercel-deploy.lib";

describe("vercel deploy helpers", () => {
  it("normalizes bare vercel hostnames into https urls", () => {
    expect(normalizeVercelUrl("microflowops-biztracker.vercel.app")).toBe(
      "https://microflowops-biztracker.vercel.app",
    );
    expect(
      normalizeVercelUrl("https://microflowops-biztracker.vercel.app"),
    ).toBe("https://microflowops-biztracker.vercel.app");
  });

  it("parses deploy json output", () => {
    expect(
      parseVercelDeployOutput(
        JSON.stringify({ url: "microflowops-biztracker.vercel.app" }),
      ),
    ).toBe("https://microflowops-biztracker.vercel.app");
  });

  it("parses deploy output that includes non-json status lines", () => {
    expect(
      parseVercelDeployOutput(
        [
          "Retrieving project...",
          "Deploying",
          JSON.stringify({ url: "microflowops-biztracker-git-main.vercel.app" }),
        ].join("\n"),
      ),
    ).toBe("https://microflowops-biztracker-git-main.vercel.app");
  });

  it("parses whoami json output and keeps rotation guidance actionable", () => {
    expect(
      parseVercelWhoAmIOutput(JSON.stringify({ username: "cchevali" })),
    ).toBe("cchevali");
    expect(getVercelCredentialRotationMessage("VERCEL_TOKEN")).toContain(
      "classic Vercel personal token",
    );
  });
});
