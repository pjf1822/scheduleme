import {
  fetchShiftsByDate,
  fetchShiftsByTeamId,
  getShiftByIdDB,
  insertShift,
  updateShiftAssignment,
} from "../db/shifts";
// initial data call
export async function getShiftsByTeamId(teamId: string) {
  return fetchShiftsByTeamId(teamId);
}
// when the admin clicks a date
export async function getShiftsByDate(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return fetchShiftsByDate(teamId, start_time, end_time);
}
export async function getShiftById(slotId: string) {
  return getShiftByIdDB(slotId);
}
export async function createShift(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  if (!roleId) throw new Error("Role required");

  return insertShift(teamId, roleId, start_time, end_time);
}

export async function assignShift(shiftId: string, user_id: string | null) {
  return updateShiftAssignment(shiftId, user_id);
}
