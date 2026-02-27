import { createClient } from "../supabase/server";

export async function getBusyBlocksByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("busy_blocks")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}

export async function insertBusyBlock(params: {
  userId: string;
  startTime: string;
  endTime: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("busy_blocks")
    .insert({
      user_id: params.userId,
      start_time: params.startTime,
      end_time: params.endTime,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
