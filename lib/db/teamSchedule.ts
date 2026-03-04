import { createClient } from "../supabase/server";

export async function insertTeamScheduleBlock(block: {
  team_id: string;
  user_id: string | null;
  start_time: string;
  end_time: string;
  created_by: string;
  role_id: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_schedule")
    .insert(block)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteTeamScheduleBlock(
  userId: string,
  teamId: string,
  start_time: string,
  end_time: string,
  role_id: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("team_schedule")
    .delete()
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .eq("start_time", start_time)
    .eq("end_time", end_time)
    .eq("role_id", role_id);

  if (error) throw error;
}
