import { getCurrentUserBusyBlocks } from "@/lib/services/busyBlocks";
import CalendarComp from "../components/CalendarComp";
import { createClient } from "@/lib/supabase/server";
import { getAdminTeamData } from "@/lib/services/admin";
import TeamScheduleCalendarComp from "../components/TeamScheduleCalendarComp";

const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const userRole = data?.claims?.user_role;

  if (userRole === "admin") {
    const { busyBlocks, teamMembers, teamId, scheduleBlocks } =
      await getAdminTeamData();

    return (
      <div>
        <h1>Dashboard</h1>
        <TeamScheduleCalendarComp
          busyBlocks={busyBlocks}
          teamMembers={teamMembers}
          teamId={teamId}
          initialScheduleBlocks={scheduleBlocks}
        />
      </div>
    );
  }

  const busyBlocks = await getCurrentUserBusyBlocks();
  return (
    <div>
      <h1>Dashboard</h1>
      <CalendarComp busyBlocks={busyBlocks} />
    </div>
  );
};

export default page;
