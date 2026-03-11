"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  BusyBlock,
  ShiftWithProfile,
  TeamMember,
  TeamRoles,
} from "@/lib/types/dbexports";

import { useMemo, useRef, useState } from "react";
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
  shifts: ShiftWithProfile[];
  roles: TeamRoles[];
};

const TeamScheduleCalendarComp = ({
  busyBlocks,
  teamMembers,
  teamId,
  shifts: initialShifts,
  roles,
}: Props) => {
  const [initialView] = useState(() => {
    if (typeof window === "undefined") return "dayGridMonth";
    return window.innerWidth < 768 ? "dayGridWeek" : "dayGridMonth";
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarShifts, setCalendarShifts] =
    useState<ShiftWithProfile[]>(initialShifts);
  const [modalShifts, setModalShifts] = useState<ShiftWithProfile[]>([]);

  const calendarRef = useRef<FullCalendar | null>(null);
  const events = useMemo(
    () => [
      ...convertShiftsForEventCalendar(calendarShifts, roles),
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
    const dateStr = info.dateStr.split("T")[0];
    const { start_time, end_time } = createBlockFromDate(dateStr);
    const dayShifts = await getShiftsByDateAction(teamId, start_time, end_time);
    setModalShifts(dayShifts);
    setSelectedDate(info.dateStr);
  };

  return (
    <>
      <style>{`
      .calendar-day-number , .calendar-event-title {
        color: white;
        transition: color 0.15s;
      }

      .fc-daygrid-day:hover .calendar-day-number , .fc-daygrid-day:hover .calendar-event-title {
        color: black;
      }
    `}</style>
      <div className="px-2 sm:px-0">
        <h2>Team Schedule</h2>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          fixedWeekCount={false}
          initialView={initialView}
          showNonCurrentDates={false}
          height={initialView === "dayGridWeek" ? 500 : "auto"}
          dateClick={handleDateClick}
          events={events}
          eventInteractive={false}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          dayMaxEvents={3}
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
            const dayShifts = calendarShifts.filter(
              (shift) =>
                new Date(shift.start_time).toISOString().split("T")[0] ===
                dateStr,
            );

            return (
              <div className="flex justify-between items-center w-full px-1">
                <div className="flex gap-0.5 flex-wrap">
                  {Array.from({ length: busyCount }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xl font-bold">
                      ✕
                    </span>
                  ))}
                </div>
                <span className="calendar-day-number">{arg.dayNumberText}</span>
                {initialView === "dayGridWeek" &&
                  dayShifts
                    .filter((shift) => shift.assigned_user_id)
                    .map((shift) => {
                      const role = roles.find((r) => r.id === shift.role_id);
                      return (
                        <div key={shift.id} className="flex items-center gap-1">
                          {/* {role?.color && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: role.color }}
                          />
                        )} */}
                          {/* {shift.assigned_user_id && (
                          <MemberAvatar
                            avatarUrl={shift.profiles?.avatar_url ?? undefined}
                            name={shift.profiles?.display_name}
                            size="sm"
                          />
                        )} */}
                        </div>
                      );
                    })}
              </div>
            );
          }}
          eventContent={(arg) => {
            const type = arg.event.extendedProps.type;

            if (type === "shift") {
              const roleColor = arg.event.extendedProps.roleColor;

              return (
                <div className="flex items-center gap-1 px-1">
                  {roleColor && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: roleColor }}
                    />
                  )}
                  {initialView !== "dayGridWeek" && (
                    <MemberAvatar
                      avatarUrl={arg.event.extendedProps.avatarUrl}
                      name={arg.event.title}
                      size="lg"
                    />
                  )}
                  <span className="text-xs truncate calendar-event-title">
                    {arg.event.title}
                  </span>
                </div>
              );
            }

            return null;
          }}
          dayCellClassNames={() =>
            "cursor-pointer border border-neutral-200 hover:bg-neutral-50 transition"
          }
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
          onClose={() => {
            setSelectedDate(null);

            setTimeout(() => {
              calendarRef.current?.getApi().updateSize();
            }, 0);
          }}
          teamId={teamId}
          roles={roles}
          shifts={modalShifts}
          onShiftCreated={(newShifts) => {
            setModalShifts((prev) => [...prev, ...newShifts]);
            setCalendarShifts((prev) => [...prev, ...newShifts]);
          }}
          onShiftAssigned={(updatedShift) => {
            const update = (prev: ShiftWithProfile[]) =>
              prev.map((s) => (s.id === updatedShift.id ? updatedShift : s));
            setModalShifts(update);
            setCalendarShifts(update);
          }}
          onShiftDeleted={(shiftId) => {
            const remove = (prev: ShiftWithProfile[]) =>
              prev.filter((s) => s.id !== shiftId);
            setModalShifts(remove);
            setCalendarShifts(remove);
          }}
        />
      </div>
    </>
  );
};

export default TeamScheduleCalendarComp;
