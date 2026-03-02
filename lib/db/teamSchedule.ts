import { createClient } from "../supabase/server";

export async function insertTeamScheduleBlock(block: {
  team_id: string;
  user_id: string | null;
  start_time: string;
  end_time: string;
  created_by: string;
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

export async function deleteTeamScheduleBlock(blockId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("team_schedule")
    .delete()
    .eq("id", blockId);

  if (error) throw error;
}
