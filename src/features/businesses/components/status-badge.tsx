import type { DealStatus } from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";

import { getDealStatusLabel } from "../domain/business.types";

type StatusBadgeProps = {
  status: DealStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone =
    status === "PASSED"
      ? "danger"
      : status === "CLOSED"
        ? "success"
        : status === "UNDER_REVIEW" || status === "LETTER_OF_INTENT"
          ? "warning"
          : status === "WATCHLIST" || status === "RESEARCHING"
            ? "accent"
            : "neutral";

  return <Badge tone={tone}>{getDealStatusLabel(status)}</Badge>;
}
