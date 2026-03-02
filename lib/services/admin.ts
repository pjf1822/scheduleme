import {
  getTeamMemberByUserId,
  getTeamMembersByTeamId,
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

  const adminMember = await getTeamMemberByUserId(user.id);

  const teamMembers = await getTeamMembersByTeamId(adminMember.team_id);

  const userIds = teamMembers.map((m) => m.user_id);

  const busyBlocks = await getBusyBlocksByUserIds(userIds);
  const scheduleBlocks = await getTeamScheduleByTeamId(adminMember.team_id);

  return {
    teamMembers,
    busyBlocks,
    teamId: adminMember.team_id,
    scheduleBlocks,
  };
}
