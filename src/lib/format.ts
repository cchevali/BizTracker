const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("en-US");

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return currencyFormatter.format(value);
}

export function formatInteger(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return integerFormatter.format(value);
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value}%`;
}

export function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value}/100`;
}

export function formatRating(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `${value}/5`;
}

export function formatBoolean(value: boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  return value ? "Yes" : "No";
}

export function formatDateTime(value: Date | string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}
