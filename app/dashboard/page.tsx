import { getCurrentUserBusyBlocks } from "@/lib/services/busyBlocks";
import CalendarComp from "../components/calendarComps/CalendarComp";
import { createClient } from "@/lib/supabase/server";
import { getAdminTeamData } from "@/lib/services/admin";
import TeamScheduleCalendarComp from "../components/calendarComps/TeamScheduleCalendarComp";
import { getTeamRoles } from "@/lib/services/teamRoles";
import { getCurrentUserShifts } from "@/lib/services/shifts";

const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userRole = data?.claims?.user_role;

  if (userRole === "admin") {
    const { busyBlocks, teamMembers, teamId, shifts } =
      await getAdminTeamData();

    const roles = await getTeamRoles(teamId);

    return (
      <div className="max-w-7xl mx-auto min-h-screen ">
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
  const shifts = await getCurrentUserShifts();
  return (
    <div className="max-w-7xl mx-auto ">
      <CalendarComp busyBlocks={busyBlocks} shifts={shifts} />
    </div>
  );
};

export default page;
