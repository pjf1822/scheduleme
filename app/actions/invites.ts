"use server";
import {
  acceptInviteService,
  createInviteService,
} from "@/lib/services/invites";

export async function createInvite(
  teamId: string,
  email: string,
  teamName: string,
) {
  return createInviteService(teamId, email, teamName);
}
export async function acceptInvite(token: string, userId: string) {
  return acceptInviteService(token, userId);
}
