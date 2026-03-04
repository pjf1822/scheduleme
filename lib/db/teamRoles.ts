import { createClient } from "@/lib/supabase/server";

export async function getTeamRoles(teamId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_roles")
    .select("*")
    .eq("team_id", teamId)
    .order("name");

  if (error) throw error;
  return data;
}

export async function insertTeamRole(
  teamId: string,
  name: string,
  newColor: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_roles")
    .insert({ team_id: teamId, name, color: newColor })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTeamRole(
  roleId: string,
  name: string,
  editColor: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_roles")
    .update({ id: roleId, name, color: editColor })
    .eq("id", roleId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTeamRole(roleId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("team_roles").delete().eq("id", roleId);

  if (error) throw error;
}
