"use server";
import { completeOnboardingService } from "@/lib/services/onboardingService";

export async function completeOnboardingAction({
  teamName,
  roles,
}: {
  teamName: string;
  roles: { name: string; color: string }[];
}) {
  return completeOnboardingService(teamName, roles);
}
