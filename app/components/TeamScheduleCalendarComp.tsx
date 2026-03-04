"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  BusyBlock,
  RoleSlots,
  TeamMember,
  TeamRoles,
  TeamSchedule,
} from "@/lib/types/dbexports";
import { useMemo, useState } from "react";
import AvailabilityModal from "./AvailabilityModal";
import { getBusyBlocksByMember } from "@/lib/utils/calendar/getBusyBlocksByMember";
import { getEventsFromScheduleBlocks } from "@/lib/utils/calendar/getEventsFromScheduleBlocks";
import { getScheduleBlocksForDate } from "@/lib/utils/calendar/getScheduleBlocksForDate";
import { getAssignableMembersForDate } from "@/lib/utils/calendar/getAssignableMembersForDate";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { getRoleSlotsAction } from "../actions/roleSlots/roleSlotActions";
type Props = {
  busyBlocks: BusyBlock[];
  teamMembers: TeamMember[];
  teamId: string;
  initialScheduleBlocks: TeamSchedule[];
  roles: TeamRoles[];
};

const TeamScheduleCalendarComp = ({
  busyBlocks,
  teamMembers,
  teamId,
  initialScheduleBlocks,
  roles,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduleBlocks, setScheduleBlocks] = useState<TeamSchedule[]>(
    initialScheduleBlocks,
  );

  const [roleSlots, setRoleSlots] = useState<RoleSlots[]>([]);
  const busyBlocksByMember = getBusyBlocksByMember(teamMembers, busyBlocks);
  const events = useMemo(
    () => getEventsFromScheduleBlocks(scheduleBlocks),
    [scheduleBlocks],
  );
  const handleDateClick = async (info: any) => {
    const { start_time, end_time } = createBlockFromDate(info.dateStr);
    const slots = await getRoleSlotsAction(teamId, start_time, end_time);

    setRoleSlots(slots);

    setSelectedDate(info.dateStr);
  };

  const assignedMembers = getScheduleBlocksForDate(
    selectedDate,
    scheduleBlocks,
  );
  const availableMembers = getAssignableMembersForDate(
    selectedDate,
    teamMembers,
    busyBlocks,
    assignedMembers,
  );

  return (
    <div>
      <h2>Team Schedule</h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        fixedWeekCount={false}
        initialView="dayGridMonth"
        showNonCurrentDates={false}
        height="auto"
        dateClick={handleDateClick}
        events={events}
        eventInteractive={false}
        dayCellClassNames={() => "cursor-pointer hover:bg-gray-100"}
        // eventClick={(info) => {
        //   info.jsEvent.preventDefault();
        //   const dateStr = info.event.start?.toLocaleDateString("en-CA");
        //   setSelectedDate(dateStr ?? null);
        // }}
      />

      <div>
        {busyBlocksByMember.map(({ member, blocks }) => (
          <div key={member.id}>
            <h3>{member.user_id}</h3>

            <ul>
              {blocks.map((block) => (
                <li key={block.id}>
                  {new Date(block.start_time).toLocaleDateString("en-CA")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <AvailabilityModal
        selectedDate={selectedDate}
        availableMembers={availableMembers}
        assignedMembers={assignedMembers}
        onClose={() => setSelectedDate(null)}
        teamId={teamId}
        onAssign={(newBlock) =>
          setScheduleBlocks((prev) => [...prev, newBlock])
        }
        onRemove={(blockId) => {
          setScheduleBlocks((prev) => prev.filter((b) => b.id !== blockId));
        }}
        roles={roles}
        roleSlots={roleSlots}
        setRoleSlots={setRoleSlots}
      />
    </div>
  );
};

export default TeamScheduleCalendarComp;
