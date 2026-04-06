import { Panel } from "@/components/ui/panel";
import { formatDateTime } from "@/lib/format";

import {
  getHistoryEventLabel,
  type BusinessHistoryView,
} from "../domain/business.types";

type HistoryTimelineProps = {
  historyEvents: BusinessHistoryView[];
};

export function HistoryTimeline({ historyEvents }: HistoryTimelineProps) {
  return (
    <Panel className="p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            Change history
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
            Every significant mutation is logged here so future sessions can trace what changed.
          </p>
        </div>

        <div className="space-y-4">
          {historyEvents.map((event) => (
            <div key={event.id} className="flex gap-4">
              <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {getHistoryEventLabel(event.eventType)}
                </p>
                <p className="text-sm leading-6 text-[var(--color-muted-ink)]">
                  {event.description}
                </p>
                <p className="text-xs text-[var(--color-muted-ink)]">
                  {formatDateTime(event.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
