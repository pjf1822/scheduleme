"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addBusyBlockAction } from "../actions/addBusyBlock";
import { getBusyDateMap } from "@/lib/utils/dates/getBusyDateMap";
import { createBusyBlockFromDate } from "@/lib/utils/calendar/createBusyBlockFromDate";
import { removeBusyBlockAction } from "../actions/removeBusyBlock";

type BusyBlock = {
  id: string;
  start_time: string;
  end_time: string;
};
type Props = {
  busyBlocks: BusyBlock[];
};
const CalendarComp = ({ busyBlocks }: Props) => {
  const busyDateMap = getBusyDateMap(busyBlocks);

  const handleDateClick = async (info: any) => {
    const dateKey = info.dateStr;

    try {
      if (busyDateMap.has(dateKey)) {
        const blockId = busyDateMap.get(dateKey)!;
        await removeBusyBlockAction(blockId);
        return;
      }

      const block = createBusyBlockFromDate(dateKey);
      await addBusyBlockAction(block);
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      fixedWeekCount={false}
      initialView="dayGridMonth"
      showNonCurrentDates={false}
      height="auto"
      dayCellClassNames={(arg) => {
        const dateString = arg.date.toISOString().split("T")[0];

        if (busyDateMap.has(dateString)) {
          return ["busy-day"];
        }
        return [];
      }}
    />
  );
};

export default CalendarComp;
