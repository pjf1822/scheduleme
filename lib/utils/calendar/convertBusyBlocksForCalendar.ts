import { BusyBlock } from "@/lib/types/dbexports";

export function convertBusyBlocksForCalendar(busyBlocks: BusyBlock[]) {
  const byDate = new Map<string, Set<string>>();

  for (const block of busyBlocks) {
    const date = new Date(block.start_time).toISOString().split("T")[0];
    if (!byDate.has(date)) byDate.set(date, new Set());
    byDate.get(date)!.add(block.user_id);
  }

  return [...byDate.entries()].map(([date, userIds]) => ({
    title: "",
    start: date,
    allDay: true,
    extendedProps: { type: "busy", count: userIds.size },
  }));
}
