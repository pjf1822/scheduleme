import {
  getTeamContextForUser,
  getTeamScheduleByTeamId,
} from "../db/teamMembers";
import { createClient } from "../supabase/server";
import { getBusyBlocksByUserIds } from "./busyBlocks";

export async function getAdminTeamData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { adminMember, teamMembers, teamUserIds } = await getTeamContextForUser(
    user.id,
  );

  const busyBlocks = await getBusyBlocksByUserIds(teamUserIds);
  const scheduleBlocks = await getTeamScheduleByTeamId(adminMember.team_id);

  return {
    teamMembers,
    busyBlocks,
    teamId: adminMember.team_id,
    scheduleBlocks,
  };
}
