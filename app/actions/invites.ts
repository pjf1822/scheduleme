"use server";
import { sendInviteEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export async function createInvite(teamId: string, email: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invite, error } = await supabase
    .from("invites")
    .insert({
      team_id: teamId,
      email,
      invited_by: user!.id,
      // accepted defaults to false, expires_at defaults to now()+7days
    })
    .select("token") // get the generated token back
    .single();

  if (error) throw error;

  await sendInviteEmail({ email, token: invite.token });
}
export async function acceptInvite(token: string, userId: string) {
  const supabase = await createClient();

  // find the invite by token
  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .eq("accepted", false)
    .gt("expires_at", new Date().toISOString())
    .single();
  console.log(invite, "the ivite");

  if (!invite) throw new Error("Invalid or expired invite");

  // add them to the team
  await supabase.from("team_members").insert({
    team_id: invite.team_id,
    user_id: userId,
  });

  await supabase
    .from("profiles")
    .update({ has_onboarded: true })
    .eq("id", userId);

  // mark invite as used
  await supabase.from("invites").update({ accepted: true }).eq("id", invite.id);
}
