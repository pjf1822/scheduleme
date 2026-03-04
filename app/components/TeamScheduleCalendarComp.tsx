"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  BusyBlock,
  Shifts,
  TeamMember,
  TeamRoles,
} from "@/lib/types/dbexports";
import { useMemo, useState } from "react";
import AvailabilityModal from "./AvailabilityModal";
import { getBusyBlocksByMember } from "@/lib/utils/calendar/getBusyBlocksByMember";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { getShiftsByDateAction } from "../actions/shifts/shiftActions";
type Props = {
  busyBlocks: BusyBlock[];
  teamMembers: TeamMember[];
  teamId: string;
  shifts: Shifts[];
  roles: TeamRoles[];
};

const TeamScheduleCalendarComp = ({
  busyBlocks,
  teamMembers,
  teamId,
  shifts: initialShifts,
  roles,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [shifts, setShifts] = useState<Shifts[]>(initialShifts);
  const busyBlocksByMember = getBusyBlocksByMember(teamMembers, busyBlocks);

  const events = useMemo(() => {
    return shifts
      .filter((shift) => shift.assigned_user_id)
      .map((shift) => ({
        title: shift.assigned_user_id as string,
        start: shift.start_time as string,
        end: shift.end_time as string,
      }));
  }, [shifts]);

  const handleDateClick = async (info: any) => {
    const { start_time, end_time } = createBlockFromDate(info.dateStr);
    const shifts = await getShiftsByDateAction(teamId, start_time, end_time);
    setShifts(shifts);
    setSelectedDate(info.dateStr);
  };
  const handleShiftsCreated = (newShifts: Shifts[]) => {
    setShifts((prev) => [...prev, ...newShifts]);
  };

  const assignedUserIds = new Set(
    shifts.map((shift) => shift.assigned_user_id).filter(Boolean),
  );
  const availableMembers = teamMembers.filter(
    (member) =>
      !assignedUserIds.has(member.user_id) &&
      !busyBlocks.some(
        (block) =>
          block.user_id === member.user_id &&
          new Date(block.start_time).toISOString().split("T")[0] ===
            selectedDate,
      ),
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
        onClose={() => setSelectedDate(null)}
        teamId={teamId}
        roles={roles}
        shifts={shifts}
        onShiftCreated={handleShiftsCreated}
      />
    </div>
  );
};

export default TeamScheduleCalendarComp;
