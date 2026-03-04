import { insertRoleSlot, updateRoleSlotAssignment } from "../db/roleSlots";

import { getRoleSlotsForDate } from "@/lib/db/roleSlots";

export async function fetchRoleSlots(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return getRoleSlotsForDate(teamId, start_time, end_time);
}
export async function createRoleSlot(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  if (!roleId) throw new Error("Role required");

  return insertRoleSlot(teamId, roleId, start_time, end_time);
}

export async function assignRoleSlot(slotId: string, user_id: string | null) {
  return updateRoleSlotAssignment(slotId, user_id);
}
