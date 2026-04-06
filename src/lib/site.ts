function normalizeBasePath(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withoutTrailingSlash = trimmed.endsWith("/")
    ? trimmed.slice(0, -1)
    : trimmed;

  return withoutTrailingSlash.startsWith("/")
    ? withoutTrailingSlash
    : `/${withoutTrailingSlash}`;
}

export const siteBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export function withBasePath(path: string) {
  if (!siteBasePath) {
    return path;
  }

  if (path === "/") {
    return siteBasePath;
  }

  if (!path.startsWith("/")) {
    return path;
  }

  return `${siteBasePath}${path}`;
}
