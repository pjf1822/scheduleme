import {
  fetchShiftsByDate,
  fetchShiftsByTeamId,
  fetchShiftsByUserId,
  insertShift,
  updateShiftAssignment,
} from "../db/shifts";
import { createClient } from "../supabase/server";

export async function getShiftsByTeamId(teamId: string) {
  return fetchShiftsByTeamId(teamId);
}

export async function getShiftsByDate(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return fetchShiftsByDate(teamId, start_time, end_time);
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

export async function getCurrentUserShifts() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) return [];

  return fetchShiftsByUserId(userId);
}
