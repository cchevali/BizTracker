CREATE TYPE "PipelineBucket" AS ENUM ('ACTIVE', 'WATCHLIST', 'COMP_ONLY', 'UNVERIFIED');

ALTER TABLE "Business"
ADD COLUMN "pipelineBucket" "PipelineBucket" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "publicSourceVerified" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Business_pipelineBucket_idx" ON "Business"("pipelineBucket");
CREATE INDEX "Business_publicSourceVerified_idx" ON "Business"("publicSourceVerified");
