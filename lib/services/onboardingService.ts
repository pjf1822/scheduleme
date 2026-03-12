import { createClient } from "@/lib/supabase/server";
import { runCompleteOnboardingRpc } from "@/lib/db/onboarding";
import { updateProfileOnboarding } from "../db/profiles";
import { createInviteService } from "./invites";

export async function completeOnboardingService(
  teamName: string,
  roles: { name: string; color: string }[],
  invites?: string[],
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const teamId = await runCompleteOnboardingRpc(user.id, teamName, roles);

  if (invites?.length) {
    const validInvites = invites.filter((email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    );

    const results = await Promise.allSettled(
      validInvites.map((email) => createInviteService(teamId, email, teamName)),
    );

    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("Invite failed:", r.reason);
      }
    });
  }
  await supabase.auth.refreshSession();

  await updateProfileOnboarding(user.id);
}
