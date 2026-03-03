import { insertRoleSlot, updateRoleSlotAssignment } from "../db/roleSlots";

export async function createRoleSlot(
  teamId: string,
  roleId: string,
  start: string,
  end: string,
) {
  if (!roleId) throw new Error("Role required");

  return insertRoleSlot(teamId, roleId, start, end);
}

export async function assignRoleSlot(slotId: string, userId: string) {
  if (!userId) throw new Error("User required");

  return updateRoleSlotAssignment(slotId, userId);
}
