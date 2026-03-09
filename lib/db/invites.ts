import { createClient } from "@/lib/supabase/server";

export async function insertInvite(
  teamId: string,
  email: string,
  invitedBy: string,
  teamName: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invites")
    .insert({
      team_id: teamId,
      email,
      invited_by: invitedBy,
      team_name: teamName,
    })
    .select("id, token")
    .single();

  if (error) throw error;

  return data;
}

export async function getInviteByToken(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error) return null;

  return data;
}

export async function markInviteAccepted(inviteId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invites")
    .update({ accepted: true })
    .eq("id", inviteId);

  if (error) throw error;
}
