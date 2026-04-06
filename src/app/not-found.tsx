import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <div className="py-16">
      <EmptyState
        title="Business not found"
        description="The requested record does not exist or may have been removed."
        actionHref="/"
        actionLabel="Back to dashboard"
      />
      <div className="mt-4 text-center">
        <Link href="/" className={buttonStyles({ variant: "ghost" })}>
          Return home
        </Link>
      </div>
    </div>
  );
}
