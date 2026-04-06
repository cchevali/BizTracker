import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatDateTime } from "@/lib/format";

import { deleteFilterPresetAction } from "../actions/business-actions";
import { buildBusinessListHref } from "../domain/business.filters";
import type { FilterPresetView } from "../domain/business.types";
import { SavePresetForm } from "./save-preset-form";

type PresetPanelProps = {
  presets: FilterPresetView[];
  queryJson: string;
};

export function PresetPanel({ presets, queryJson }: PresetPanelProps) {
  return (
    <Panel className="p-5">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            Saved presets
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-ink)]">
            Presets snapshot the current URL filters so they remain portable across future chats.
          </p>
        </div>

        <SavePresetForm queryJson={queryJson} />

        <div className="space-y-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {preset.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted-ink)]">
                    Updated {formatDateTime(preset.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={buildBusinessListHref(preset.query)}
                  className={buttonStyles({ variant: "secondary", size: "sm" })}
                >
                  Apply
                </Link>
                <form action={deleteFilterPresetAction}>
                  <input type="hidden" name="presetId" value={preset.id} />
                  <SubmitButton
                    label="Delete"
                    pendingLabel="Deleting..."
                    variant="ghost"
                    size="sm"
                  />
                </form>
              </div>
            </div>
          ))}

          {presets.length === 0 ? (
            <p className="rounded-[24px] bg-[var(--color-panel-muted)] px-4 py-3 text-sm text-[var(--color-muted-ink)]">
              No presets yet. Save one after you dial in a filter combination you want to revisit.
            </p>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
