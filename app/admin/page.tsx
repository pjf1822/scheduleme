import { getTeamContextForUser } from "@/lib/db/teamMembers";
import { fetchTeamRoles } from "@/lib/services/teamRoles";
import { createClient } from "@/lib/supabase/server";
import React from "react";
import TeamRolesManager from "../components/TeamRolesManager";

const AdminPage = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const userId = data?.claims.sub;
  if (!userId) throw new Error("No user id");

  const { adminMember } = await getTeamContextForUser(userId);

  const roles = await fetchTeamRoles(adminMember.team_id);
  return (
    <div>
      <TeamRolesManager roles={roles} teamId={adminMember.team_id} />
    </div>
  );
};

export default AdminPage;
