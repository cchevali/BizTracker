import type { PipelineBucket } from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";

import { getPipelineBucketLabel } from "../domain/business.types";

type PipelineBadgeProps = {
  bucket: PipelineBucket;
};

export function PipelineBadge({ bucket }: PipelineBadgeProps) {
  const tone =
    bucket === "ACTIVE"
      ? "success"
      : bucket === "WATCHLIST"
        ? "accent"
        : bucket === "UNVERIFIED"
          ? "warning"
          : "neutral";

  return <Badge tone={tone}>{getPipelineBucketLabel(bucket)}</Badge>;
}
