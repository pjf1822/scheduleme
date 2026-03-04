"use server";

import {
  assignRoleSlot,
  createRoleSlot,
  fetchRoleSlots,
} from "@/lib/services/roleSlots";
import { revalidatePath } from "next/cache";

export async function getRoleSlotsAction(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return await fetchRoleSlots(teamId, start_time, end_time);
}
export async function createRoleSlotAction(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  await createRoleSlot(teamId, roleId, start_time, end_time);

  revalidatePath("/dashboard");
}

export async function assignRoleSlotAction(
  slotId: string,
  user_id: string | null,
) {
  await assignRoleSlot(slotId, user_id);

  revalidatePath("/dashboard");
}
