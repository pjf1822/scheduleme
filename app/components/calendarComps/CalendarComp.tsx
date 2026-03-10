"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getBusyDateMap } from "@/lib/utils/dates/getBusyDateMap";
import { useRef, useState } from "react";
import { BusyBlock, UserShift } from "@/lib/types/dbexports";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";
import {
  addBusyBlockAction,
  removeBusyBlockAction,
} from "../../actions/busyBlocks";
import { mapShiftsToEvents } from "@/lib/utils/shifts/ mapShiftsToEvents";
import EventDetailModal from "../eventDetailModal/EventDetailModal";
import { createShiftDateMap } from "@/lib/utils/shifts/createShiftDateMap";
import timeGridPlugin from "@fullcalendar/timegrid";
type Props = {
  busyBlocks: BusyBlock[];
  shifts: UserShift[];
};

const CalendarComp = ({ busyBlocks, shifts }: Props) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const pendingDates = useRef(new Set<string>());
  const busyDateMap = getBusyDateMap(busyBlocks);
  const shiftEvents = mapShiftsToEvents(shifts);
  const [selectedShift, setSelectedShift] = useState<UserShift | null>(null);

  const shiftDateMap = createShiftDateMap(shifts);

  const handleDateClick = async (info: any) => {
    const dateKey = info.date.toLocaleDateString("en-CA");
    const shiftsForDay = shiftDateMap.get(dateKey);

    if (shiftsForDay && shiftsForDay.length > 0) {
      setSelectedShift(shiftsForDay[0]);
      return;
    }
    if (pendingDates.current.has(dateKey)) {
      return;
    }
    pendingDates.current.add(dateKey);
    try {
      if (busyDateMap.has(dateKey)) {
        const blockId = busyDateMap.get(dateKey)!;
        await removeBusyBlockAction(blockId);
        return;
      }

      const block = createBlockFromDate(dateKey);

      await addBusyBlockAction(block);
    } catch (err) {
      console.error("Toggle failed", err);
    } finally {
      pendingDates.current.delete(dateKey);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dateClick={handleDateClick}
        eventInteractive={false}
        fixedWeekCount={false}
        slotMinTime="10:00:00"
        slotMaxTime="20:00:00"
        initialView={isMobile ? "timeGridWeek" : "dayGridMonth"}
        showNonCurrentDates={false}
        events={shiftEvents}
        height="auto"
        eventContent={(arg) => {
          console.log(arg);
          const type = arg.event.extendedProps.type;

          if (type === "shift") {
            return (
              <div className="flex items-center gap-1 px-1 ">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: arg.event.backgroundColor }}
                />
                <span className="text-xs truncate">{arg.event.title}</span>
              </div>
            );
          }

          return null;
        }}
        dayCellClassNames={(arg) => {
          const dateString = arg.date.toLocaleDateString("en-CA");

          if (busyDateMap.has(dateString)) {
            return ["busy-day"];
          }
          return [];
        }}
      />
      <EventDetailModal
        shift={selectedShift}
        onClose={() => setSelectedShift(null)}
      />
    </div>
  );
};

export default CalendarComp;
