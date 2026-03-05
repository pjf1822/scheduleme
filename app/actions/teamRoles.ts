"use server";

import {
  createTeamRole,
  renameTeamRole,
  removeTeamRole,
} from "@/lib/services/teamRoles";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();

  const { count } = await supabase
    .from("shifts")
    .select("*", { count: "exact", head: true })
    .eq("role_id", roleId);

  if (count && count > 0) {
    throw new Error("Cannot delete a role that has active shifts");
  }
  await removeTeamRole(roleId);
  revalidatePath("/settings");
}
