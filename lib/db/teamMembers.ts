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
export async function getTeamMemberByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function getTeamMembersByTeamId(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", teamId);

  if (error) throw error;

  return data;
}
