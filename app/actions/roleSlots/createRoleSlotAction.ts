"use server";

import { assignRoleSlot, createRoleSlot } from "@/lib/services/roleSlots";
import { revalidatePath } from "next/cache";

export async function createRoleSlotAction(
  teamId: string,
  roleId: string,
  start: string,
  end: string,
) {
  await createRoleSlot(teamId, roleId, start, end);

  revalidatePath("/dashboard");
}

export async function assignRoleSlotAction(slotId: string, userId: string) {
  await assignRoleSlot(slotId, userId);

  revalidatePath("/dashboard");
}
