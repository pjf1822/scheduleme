import { insertTeamScheduleBlock } from "../db/teamSchedule";
import { createClient } from "../supabase/server";

export async function assignTeamMemberToDate(
  userId: string | null,
  teamId: string,
  start_time: string,
  end_time: string,
  role_id: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return await insertTeamScheduleBlock({
    user_id: userId,
    team_id: teamId,
    start_time,
    end_time,

    created_by: user.id,
    role_id,
  });
}

import { deleteTeamScheduleBlock } from "@/lib/db/teamSchedule";

export async function removeTeamScheduleBlock(
  userId: string,
  teamId: string,
  start_time: string,
  end_time: string,
  role_id: string,
) {
  return deleteTeamScheduleBlock(userId, teamId, start_time, end_time, role_id);
}
