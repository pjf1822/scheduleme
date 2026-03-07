import { getTeamContextForUser } from "@/lib/db/teamMembers";
import { createClient } from "@/lib/supabase/server";
import TeamRolesManager from "../components/adminPage/TeamRolesManager";
import { fetchTeamRoles } from "@/lib/db/teamRoles";
import TeamMemberList from "../components/adminPage/TeamMemberList";
import InviteUsers from "../components/adminPage/InviteUsers";

const AdminPage = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const userId = data?.claims.sub;
  if (!userId) throw new Error("No user id");

  const { adminMember, teamMembers } = await getTeamContextForUser(userId);

  const roles = await fetchTeamRoles(adminMember.team_id);
  return (
    <div>
      <TeamMemberList teamMembers={teamMembers} />
      <InviteUsers teamId={adminMember.team_id} />

      <TeamRolesManager roles={roles} teamId={adminMember.team_id} />
    </div>
  );
};

export default AdminPage;
