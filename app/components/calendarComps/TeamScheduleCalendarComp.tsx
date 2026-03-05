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
import AvailabilityModal from "../availModalComponents/AvailabilityModal";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import { getShiftsByDateAction } from "../../actions/shifts";
import { convertShiftsForEventCalendar } from "@/lib/utils/calendar/convertShiftsForEventCalendar";
import { getAvailableMembers } from "@/lib/utils/calendar/getAvailableMembers";
import { convertBusyBlocksForCalendar } from "@/lib/utils/calendar/convertBusyBlocksForCalendar";
import { MemberAvatar } from "../uiPieces/MemberAvatar";
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
    () => [
      ...convertShiftsForEventCalendar(calendarShifts),
      ...convertBusyBlocksForCalendar(busyBlocks),
    ],
    [calendarShifts, busyBlocks],
  );

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
        eventBackgroundColor="transparent"
        eventBorderColor="transparent"
        dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().split("T")[0];
          const busyCount = new Set(
            busyBlocks
              .filter(
                (block) =>
                  new Date(block.start_time).toISOString().split("T")[0] ===
                  dateStr,
              )
              .map((block) => block.user_id),
          ).size;

          return (
            <div className="flex justify-between items-center w-full px-1">
              <div className="flex gap-0.5 flex-wrap">
                {Array.from({ length: busyCount }).map((_, i) => (
                  <span key={i} className="text-red-500 text-xs font-bold">
                    ✕
                  </span>
                ))}
              </div>
              <span>{arg.dayNumberText}</span>
            </div>
          );
        }}
        eventContent={(arg) => {
          const type = arg.event.extendedProps.type;

          if (type === "shift") {
            return (
              <div className="flex items-center gap-1 px-1">
                <MemberAvatar
                  avatarUrl={arg.event.extendedProps.avatarUrl}
                  name={arg.event.title}
                  size="lg"
                />
                <span className="text-xs truncate">{arg.event.title}</span>
              </div>
            );
          }

          return null;
        }}
        dayCellClassNames={() => "cursor-pointer hover:bg-gray-100"}
      />

      <AvailabilityModal
        selectedDate={selectedDate}
        availableMembers={availableMembers}
        unavailableMembers={teamMembers.filter((member) =>
          busyBlocks.some(
            (block) =>
              block.user_id === member.user_id &&
              new Date(block.start_time).toISOString().split("T")[0] ===
                selectedDate,
          ),
        )}
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
