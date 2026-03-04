"use server";

import {
  assignRoleSlot,
  createRoleSlot,
  fetchRoleSlots,
  getRoleSlotById,
} from "@/lib/services/roleSlots";
import {
  assignTeamMemberToDate,
  removeTeamScheduleBlock,
} from "@/lib/services/teamSchedule";
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
  const previousSlot = await getRoleSlotById(slotId);

  const slot = await assignRoleSlot(slotId, user_id);

  if (slot.assigned_user_id) {
    await assignTeamMemberToDate(
      slot.assigned_user_id,
      slot.team_id,
      slot.start_time,
      slot.end_time,
      slot.role_id,
    );
  }

  if (previousSlot.assigned_user_id && !slot.assigned_user_id) {
    await removeTeamScheduleBlock(
      previousSlot.assigned_user_id,
      slot.team_id,
      slot.start_time,
      slot.end_time,
      slot.role_id,
    );
  }

  revalidatePath("/dashboard");
}
