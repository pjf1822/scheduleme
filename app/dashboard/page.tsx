import { getCurrentUserBusyBlocks } from "@/lib/services/busyBlocks";
import CalendarComp from "../components/calendarComps/CalendarComp";
import { createClient } from "@/lib/supabase/server";
import { getAdminTeamData } from "@/lib/services/admin";
import TeamScheduleCalendarComp from "../components/calendarComps/TeamScheduleCalendarComp";
import { getTeamRoles } from "@/lib/services/teamRoles";

const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userRole = data?.claims?.user_role;

  if (userRole === "admin") {
    const { busyBlocks, teamMembers, teamId, shifts } =
      await getAdminTeamData();

    const roles = await getTeamRoles(teamId);

    return (
      <div className="max-w-7xl mx-auto ">
        <TeamScheduleCalendarComp
          busyBlocks={busyBlocks}
          teamMembers={teamMembers}
          teamId={teamId}
          shifts={shifts}
          roles={roles}
        />
      </div>
    );
  }

  const busyBlocks = await getCurrentUserBusyBlocks();
  return <CalendarComp busyBlocks={busyBlocks} />;
};

export default page;
