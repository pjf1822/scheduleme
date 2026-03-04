"use server";

import {
  createTeamRole,
  renameTeamRole,
  removeTeamRole,
} from "@/lib/services/teamRoles";
import { revalidatePath } from "next/cache";

export async function createTeamRoleAction(
  teamId: string,
  name: string,
  newColor: string,
) {
  await createTeamRole(teamId, name, newColor);
  revalidatePath("/settings");
}

export async function updateTeamRoleAction(
  roleId: string,
  name: string,
  editColor: string,
) {
  await renameTeamRole(roleId, name, editColor);
  revalidatePath("/settings");
}

export async function deleteTeamRoleAction(roleId: string) {
  await removeTeamRole(roleId);
  revalidatePath("/settings");
}
