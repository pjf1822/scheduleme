import { createClient } from "@/lib/supabase/server";

export async function runCompleteOnboardingRpc(
  userId: string,
  teamName: string,
  roles: { name: string; color: string }[],
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("complete_onboarding_full", {
    p_user_id: userId,
    p_team_name: teamName,
    p_roles: roles,
  });

  if (error) throw new Error(error.message);
  return data;
}
