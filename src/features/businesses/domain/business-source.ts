const NON_PUBLIC_SOURCE_HOSTS = new Set([
  "chat.openai.com",
  "chatgpt.com",
  "openai.com",
  "www.openai.com",
  "localhost",
  "127.0.0.1",
]);

export function normalizeBusinessCategory(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isPublicListingSourceUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    if (NON_PUBLIC_SOURCE_HOSTS.has(host) || host.endsWith(".openai.com")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function formatNullableBooleanLabel(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  return value ? "Yes" : "No";
}
