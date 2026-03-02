"use server";

import {
  createTeamRole,
  renameTeamRole,
  removeTeamRole,
} from "@/lib/services/teamRoles";
import { revalidatePath } from "next/cache";

export async function createTeamRoleAction(teamId: string, name: string) {
  await createTeamRole(teamId, name);
  revalidatePath("/settings");
}

export async function updateTeamRoleAction(roleId: string, name: string) {
  await renameTeamRole(roleId, name);
  revalidatePath("/settings");
}

export async function deleteTeamRoleAction(roleId: string) {
  await removeTeamRole(roleId);
  revalidatePath("/settings");
}
