import {
  getTeamRoles,
  insertTeamRole,
  updateTeamRole,
  deleteTeamRole,
} from "@/lib/db/teamRoles";

export async function fetchTeamRoles(teamId: string) {
  return getTeamRoles(teamId);
}

export async function createTeamRole(
  teamId: string,
  name: string,
  newColor: string,
) {
  if (!name.trim()) throw new Error("Role name required");
  return insertTeamRole(teamId, name.trim(), newColor);
}

export async function renameTeamRole(
  roleId: string,
  name: string,
  editColor: string,
) {
  if (!name.trim()) throw new Error("Role name required");
  return updateTeamRole(roleId, name.trim(), editColor);
}

export async function removeTeamRole(roleId: string) {
  return deleteTeamRole(roleId);
}
