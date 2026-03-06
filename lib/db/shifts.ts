import { createClient } from "@/lib/supabase/server";

// initial data call
export async function fetchShiftsByTeamId(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shifts")
    .select(
      `
    *,
    profiles:assigned_user_id(display_name, avatar_url)
  `,
    )
    .eq("team_id", teamId);

  if (error) throw error;

  return data;
}

// when the admin clicks a date
export async function fetchShiftsByDate(
  teamId: string,
  start_time: string,
  end_time: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shifts")
    .select(
      `
  *,
  profiles:assigned_user_id(display_name, avatar_url)
`,
    )
    .eq("team_id", teamId)
    .gte("start_time", start_time)
    .lte("end_time", end_time)
    .order("start_time");

  if (error) throw error;

  return data;
}
export async function insertShift(
  teamId: string,
  roleId: string,
  start_time: string,
  end_time: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shifts")
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

export async function updateShiftAssignment(
  shiftId: string,
  user_id: string | null,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shifts")
    .update({
      assigned_user_id: user_id || null,
    })
    .eq("id", shiftId)
    .select(
      `
  *,
  profiles:assigned_user_id(display_name, avatar_url)
`,
    )
    .single();

  if (error) throw error;
  return data;
}

export async function fetchShiftsForCurrentUser() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("shifts")
    .select(
      `
      *,
      profiles:assigned_user_id(display_name, avatar_url),
      teams:team_id(name)
    `,
    )
    .eq("assigned_user_id", userId)
    .order("start_time");

  if (error) throw error;

  return data;
}
