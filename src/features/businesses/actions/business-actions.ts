"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addBusinessNote,
  createBusiness,
  deleteFilterPreset,
  saveFilterPreset,
  updateBusiness,
  updateBusinessStatus,
} from "../data/business-repository";
import {
  createValidationErrorState,
  parseBusinessForm,
  parseNoteForm,
  parsePresetForm,
  parseStatusForm,
} from "../domain/business.schemas";
import type { ActionState } from "../domain/business.types";

export async function createBusinessAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseBusinessForm(formData);

  if (!parsed.success) {
    return createValidationErrorState(parsed.error);
  }

  const business = await createBusiness(parsed.data);

  revalidatePath("/");
  redirect(`/businesses/${business.id}`);
}

export async function updateBusinessAction(
  businessId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseBusinessForm(formData);

  if (!parsed.success) {
    return createValidationErrorState(parsed.error);
  }

  const result = await updateBusiness(businessId, parsed.data);

  if (!result) {
    return {
      status: "error",
      message: "That business could not be found.",
    };
  }

  if (result.changedFields.length === 0) {
    return {
      status: "error",
      message: "No changes were detected.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/businesses/${businessId}`);
  revalidatePath(`/businesses/${businessId}/edit`);
  redirect(`/businesses/${businessId}`);
}

export async function addBusinessNoteAction(
  businessId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseNoteForm(formData);

  if (!parsed.success) {
    return createValidationErrorState(parsed.error);
  }

  await addBusinessNote(businessId, parsed.data.body);

  revalidatePath(`/businesses/${businessId}`);
  refresh();

  return {
    status: "success",
    message: "Note added.",
  };
}

export async function saveFilterPresetAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePresetForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  await saveFilterPreset(parsed.data.name, parsed.data.query);

  revalidatePath("/");
  refresh();

  return {
    status: "success",
    message: "Preset saved.",
  };
}

export async function deleteFilterPresetAction(formData: FormData) {
  const presetId = formData.get("presetId");

  if (typeof presetId !== "string" || !presetId) {
    return;
  }

  await deleteFilterPreset(presetId);
  revalidatePath("/");
  refresh();
}

export async function updateBusinessStatusAction(
  businessId: string,
  formData: FormData,
) {
  const parsed = parseStatusForm(formData);

  if (!parsed.success) {
    return;
  }

  await updateBusinessStatus(businessId, parsed.data.dealStatus);
  revalidatePath("/");
  revalidatePath(`/businesses/${businessId}`);
  refresh();
}
