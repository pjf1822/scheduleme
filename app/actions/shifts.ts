"use server";

import {
  assignShift,
  createShift,
  getShiftsByDate,
} from "@/lib/services/shifts";

export async function getShiftsByDateAction(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return await getShiftsByDate(teamId, start_time, end_time);
}

export async function createShiftAction(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  const shift = await createShift(teamId, roleId, start_time, end_time);
  return shift;
}

export async function assignShiftAction(
  shiftId: string,
  user_id: string | null,
) {
  const shift = await assignShift(shiftId, user_id);
  return shift;
}
