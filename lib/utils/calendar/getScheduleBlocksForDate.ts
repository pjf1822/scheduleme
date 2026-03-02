import { TeamSchedule } from "@/lib/types/dbexports";

export function getScheduleBlocksForDate(
  dateStr: string | null,
  scheduleBlocks: TeamSchedule[],
): TeamSchedule[] {
  if (!dateStr) return [];

  return scheduleBlocks.filter((block) => {
    const blockDate = new Date(block.start_time).toISOString().split("T")[0];

    return blockDate === dateStr;
  });
}
