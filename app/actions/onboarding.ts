"use server";
import { completeOnboardingService } from "@/lib/services/onboardingService";

export async function completeOnboardingAction({
  teamName,
  roles,
  invites,
}: {
  teamName: string;
  roles: { name: string; color: string }[];
  invites?: string[];
}) {
  return completeOnboardingService(teamName, roles, invites);
}
