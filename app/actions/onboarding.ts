"use server";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboardingAction({
  teamName,
  roles,
}: {
  teamName: string;
  roles: { name: string; color: string }[];
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error: rpcError } = await supabase.rpc("complete_onboarding_full", {
      p_user_id: user.id,
      p_team_name: teamName,
      p_roles: roles,
    });
    console.log(rpcError, "the rpc error");
    if (rpcError) throw new Error(rpcError.message);

    await supabase.auth.refreshSession();

    await supabase
      .from("profiles")
      .update({ has_onboarded: true })
      .eq("id", user.id);
  } catch (err) {
    console.error("ONBOARDING ERROR:", err);
    throw err;
  }
}
