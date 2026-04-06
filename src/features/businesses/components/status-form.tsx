import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";

import { updateBusinessStatusAction } from "../actions/business-actions";
import { dealStatusOptions } from "../domain/business.types";

type StatusFormProps = {
  businessId: string;
  currentStatus: (typeof dealStatusOptions)[number]["value"];
};

export function StatusForm({ businessId, currentStatus }: StatusFormProps) {
  const action = updateBusinessStatusAction.bind(null, businessId);

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select
        name="dealStatus"
        defaultValue={currentStatus}
        className="sm:min-w-64"
      >
        {dealStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <SubmitButton
        label="Update status"
        pendingLabel="Updating..."
        variant="secondary"
      />
    </form>
  );
}
