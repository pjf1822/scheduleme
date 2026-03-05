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
  const [calendarShifts, setCalendarShifts] = useState<Shifts[]>(initialShifts);
  const [modalShifts, setModalShifts] = useState<Shifts[]>([]);

  const events = useMemo(
    () => convertShiftsForEventCalendar(calendarShifts),
    [calendarShifts],
  );
  console.log(events);
  const availableMembers = getAvailableMembers(
    teamMembers,
    modalShifts,
    busyBlocks,
    selectedDate,
  );

  const handleDateClick = async (info: any) => {
    const { start_time, end_time } = createBlockFromDate(info.dateStr);
    const dayShifts = await getShiftsByDateAction(teamId, start_time, end_time);
    setModalShifts(dayShifts);
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
        eventContent={(arg) => (
          <div className="flex items-center gap-1 px-1">
            {arg.event.extendedProps.avatarUrl && (
              <img
                src={arg.event.extendedProps.avatarUrl}
                className="w-4 h-4 rounded-full"
              />
            )}
            <span className="text-xs truncate">{arg.event.title}</span>
          </div>
        )}
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
        shifts={modalShifts}
        onShiftCreated={(newShifts) => {
          setModalShifts((prev) => [...prev, ...newShifts]);
          setCalendarShifts((prev) => [...prev, ...newShifts]);
        }}
        onShiftAssigned={(updatedShift) => {
          const update = (prev: Shifts[]) =>
            prev.map((s) => (s.id === updatedShift.id ? updatedShift : s));
          setModalShifts(update);
          setCalendarShifts(update);
        }}
      />
    </div>
  );
};

export default TeamScheduleCalendarComp;
