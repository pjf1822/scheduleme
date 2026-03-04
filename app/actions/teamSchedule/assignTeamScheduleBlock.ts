"use server";

import { assignTeamMemberToDate } from "@/lib/services/teamSchedule";

export async function assignTeamScheduleBlockAction(
  userId: string | null,
  teamId: string,
  start_time: string,
  end_time: string,
) {
  return await assignTeamMemberToDate(userId, teamId, start_time, end_time);
}
