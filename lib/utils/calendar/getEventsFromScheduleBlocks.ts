import { TeamSchedule } from "@/lib/types/dbexports";

export function getEventsFromScheduleBlocks(scheduleBlocks: TeamSchedule[]) {
  return scheduleBlocks.map((block) => ({
    id: block.id,
    start: block.start_time,
    end: block.end_time,
  }));
}
