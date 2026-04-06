import Link from "next/link";

import { buttonStyles } from "./button";
import { Panel } from "./panel";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Panel className="px-8 py-12 text-center">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
        <div className="rounded-full bg-[var(--color-accent-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Empty state
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[var(--color-ink)]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-[var(--color-muted-ink)]">
            {description}
          </p>
        </div>
        {actionHref && actionLabel ? (
          <Link href={actionHref} className={buttonStyles({ variant: "primary" })}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </Panel>
  );
}
