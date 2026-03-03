import { createClient } from "@/lib/supabase/server";

export async function insertRoleSlot(
  teamId: string,
  roleId: string,
  startTime: string,
  endTime: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_role_slots")
    .insert({
      team_id: teamId,
      role_id: roleId,
      start_time: startTime,
      end_time: endTime,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRoleSlotAssignment(slotId: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_role_slots")
    .update({
      assigned_user_id: userId,
    })
    .eq("id", slotId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
