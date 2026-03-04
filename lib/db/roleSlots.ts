import { createClient } from "@/lib/supabase/server";

export async function getRoleSlotsForDate(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_role_slots")
    .select("*")
    .eq("team_id", teamId)
    .gte("start_time", start_time)
    .lte("end_time", end_time)
    .order("start_time");

  if (error) throw error;

  return data;
}
export async function insertRoleSlot(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_role_slots")
    .insert({
      team_id: teamId,
      role_id: roleId,
      start_time: start_time,
      end_time: end_time,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRoleSlotAssignment(
  slotId: string,
  user_id: string | null,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_role_slots")
    .update({
      assigned_user_id: user_id || null,
    })
    .eq("id", slotId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
