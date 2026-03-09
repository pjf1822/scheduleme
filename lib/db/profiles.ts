import { createClient } from "@/lib/supabase/server";

export async function updateProfileOnboarding(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ has_onboarded: true })
    .eq("id", userId);

  if (error) throw error;
}
