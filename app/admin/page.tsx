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

  const { adminMember, teamMembers, teamName } =
    await getTeamContextForUser(userId);

  const roles = await fetchTeamRoles(adminMember.team_id);
  return (
    <div className="max-w-7xl mx-auto flex flex-col  justify-between px-0 py-3 min-h-screen">
      <TeamMemberList teamMembers={teamMembers} />
      <InviteUsers teamId={adminMember.team_id} teamName={teamName} />
      <TeamRolesManager roles={roles} teamId={adminMember.team_id} />
    </div>
  );
};

export default AdminPage;
