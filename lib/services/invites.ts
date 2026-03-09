import { createClient } from "@/lib/supabase/server";
import {
  getInviteByToken,
  insertInvite,
  markInviteAccepted,
} from "../db/invites";
import { sendInviteEmail } from "../email";
import { addTeamMember } from "../db/teamMembers";
import { updateProfileOnboarding } from "../db/profiles";

export async function createInviteService(
  teamId: string,
  email: string,
  teamName: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const invite = await insertInvite(teamId, email, user.id, teamName);

  await sendInviteEmail({
    email,
    token: invite.token,
    teamName,
  });
}

export async function acceptInviteService(token: string, userId: string) {
  const invite = await getInviteByToken(token);

  if (!invite) throw new Error("Invalid or expired invite");

  await addTeamMember(invite.team_id, userId);

  await updateProfileOnboarding(userId);

  await markInviteAccepted(invite.id);
}
