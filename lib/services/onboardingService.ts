import { createClient } from "@/lib/supabase/server";
import { runCompleteOnboardingRpc } from "@/lib/db/onboarding";
import { updateProfileOnboarding } from "../db/profiles";

export async function completeOnboardingService(
  teamName: string,
  roles: { name: string; color: string }[],
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await runCompleteOnboardingRpc(user.id, teamName, roles);

  await supabase.auth.refreshSession();

  await updateProfileOnboarding(user.id);
}
