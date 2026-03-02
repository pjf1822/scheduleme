"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { BusyBlock, TeamMember, TeamSchedule } from "@/lib/types/dbexports";
import { useState } from "react";
import AvailabilityModal from "./AvailabilityModal";
import { getAvailableMembersForDate } from "@/lib/utils/calendar/getAvailableMembersForDate";
import { getBusyBlocksByMember } from "@/lib/utils/calendar/getBusyBlocksByMember";
import { getEventsFromScheduleBlocks } from "@/lib/utils/calendar/getEventsFromScheduleBlocks";
import { getScheduleBlocksForDate } from "@/lib/utils/calendar/getScheduleBlocksForDate";
type Props = {
  busyBlocks: BusyBlock[];
  teamMembers: TeamMember[];
  teamId: string;
  initialScheduleBlocks: TeamSchedule[];
};

const TeamScheduleCalendarComp = ({
  busyBlocks,
  teamMembers,
  teamId,
  initialScheduleBlocks,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduleBlocks, setScheduleBlocks] = useState<TeamSchedule[]>(
    initialScheduleBlocks,
  );
  const busyBlocksByMember = getBusyBlocksByMember(teamMembers, busyBlocks);
  const events = getEventsFromScheduleBlocks(scheduleBlocks);

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
  };

  const blocksForSelectedDate = getScheduleBlocksForDate(
    selectedDate,
    scheduleBlocks,
  );
  const assignedUserIds = new Set(blocksForSelectedDate.map((b) => b.user_id));
  const availableMembers = selectedDate
    ? getAvailableMembersForDate(selectedDate, teamMembers, busyBlocks).filter(
        (member) => !assignedUserIds.has(member.user_id),
      )
    : [];

  return (
    <div>
      <h2>Teacm Schedule</h2>

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
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          const dateStr = info.event.start?.toISOString().split("T")[0];
          setSelectedDate(dateStr ?? null);
        }}
      />

      <div>
        {busyBlocksByMember.map(({ member, blocks }) => (
          <div key={member.id}>
            <h3>{member.user_id}</h3>

            <ul>
              {blocks.map((block) => (
                <li key={block.id}>
                  {new Date(block.start_time).toISOString().split("T")[0]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <AvailabilityModal
        selectedDate={selectedDate}
        availableMembers={availableMembers}
        blocksForSelectedDate={blocksForSelectedDate}
        onClose={() => setSelectedDate(null)}
        teamId={teamId}
        onAssign={(newBlock) =>
          setScheduleBlocks((prev) => [...prev, newBlock])
        }
      />
    </div>
  );
};

export default TeamScheduleCalendarComp;
