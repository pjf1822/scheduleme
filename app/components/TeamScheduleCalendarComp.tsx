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
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { getShiftsByDateAction } from "../actions/shifts";
import { convertShiftsForEventCalendar } from "@/lib/utils/calendar/convertShiftsForEventCalendar";
import { getAvailableMembers } from "@/lib/utils/calendar/getAvailableMembers";
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

  const events = useMemo(() => convertShiftsForEventCalendar(shifts), [shifts]);

  const availableMembers = getAvailableMembers(
    teamMembers,
    shifts,
    busyBlocks,
    selectedDate,
  );

  const handleDateClick = async (info: any) => {
    const { start_time, end_time } = createBlockFromDate(info.dateStr);
    const dayShifts = await getShiftsByDateAction(teamId, start_time, end_time);
    setShifts(dayShifts);
    setSelectedDate(info.dateStr);
  };
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

      <AvailabilityModal
        selectedDate={selectedDate}
        availableMembers={availableMembers}
        onClose={() => setSelectedDate(null)}
        teamId={teamId}
        roles={roles}
        shifts={shifts}
        onShiftCreated={(newShifts) =>
          setShifts((prev) => [...prev, ...newShifts])
        }
        onShiftAssigned={(updatedShift) =>
          setShifts((prev) =>
            prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)),
          )
        }
      />
    </div>
  );
};

export default TeamScheduleCalendarComp;
