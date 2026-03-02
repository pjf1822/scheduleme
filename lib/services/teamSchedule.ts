import { insertTeamScheduleBlock } from "../db/teamSchedule";
import { createClient } from "../supabase/server";

export async function assignTeamMemberToDate(
  userId: string | null,
  teamId: string,
  start_time: string,
  end_time: string,
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
  });
}

import { deleteTeamScheduleBlock } from "@/lib/db/teamSchedule";

export async function removeTeamScheduleBlock(blockId: string) {
  return deleteTeamScheduleBlock(blockId);
}
