"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addBusyBlockAction } from "../actions/busyBlocks/addBusyBlock";
import { getBusyDateMap } from "@/lib/utils/dates/getBusyDateMap";
import { removeBusyBlockAction } from "../actions/busyBlocks/removeBusyBlock";
import { useRef } from "react";
import { BusyBlock } from "@/lib/types/dbexports";
import { createBlockFromDate } from "@/lib/utils/dates/createBlockFromDate";

type Props = {
  busyBlocks: BusyBlock[];
};

const CalendarComp = ({ busyBlocks }: Props) => {
  const pendingDates = useRef(new Set<string>());
  const busyDateMap = getBusyDateMap(busyBlocks);

  const handleDateClick = async (info: any) => {
    const dateKey = info.dateStr;

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
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
      fixedWeekCount={false}
      initialView="dayGridMonth"
      showNonCurrentDates={false}
      height="auto"
      dayCellClassNames={(arg) => {
        const dateString = arg.date.toLocaleDateString("en-CA");

        if (busyDateMap.has(dateString)) {
          return ["busy-day"];
        }
        return [];
      }}
    />
  );
};

export default CalendarComp;
