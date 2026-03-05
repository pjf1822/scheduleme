import { createClient } from "../supabase/server";

// FOR USER
//. 1
export async function fetchBusyBlocksByUserId(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("busy_blocks")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}
//. 2
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
//. 3
export async function deleteBusyBlock(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("busy_blocks").delete().eq("id", id);

  if (error) throw error;
}
//FOR ADMIN
//. 4
export async function fetchBusyBlocksByUserIds(userIds: string[]) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("busy_blocks")
    .select("*")
    .in("user_id", userIds);

  if (error) throw error;
  return data;
}
