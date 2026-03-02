import { createClient } from "../supabase/server";

export async function getTeamScheduleByTeamId(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_schedule")
    .select("*")
    .eq("team_id", teamId);

  if (error) throw error;

  return data;
}

export async function getTeamContextForUser(userId: string) {
  const supabase = await createClient();

  // 1️⃣ find user's team
  const { data: membership, error: memberError } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (memberError) throw memberError;

  // 2️⃣ fetch entire team
  const { data: teamMembers, error: teamError } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", membership.team_id);

  if (teamError) throw teamError;

  const teamUserIds = teamMembers.map((m) => m.user_id);

  return {
    adminMember: membership,
    teamMembers,
    teamUserIds: teamUserIds,
  };
}
