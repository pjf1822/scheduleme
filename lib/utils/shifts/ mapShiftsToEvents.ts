import { UserShift } from "@/lib/types/dbexports";

export function mapShiftsToEvents(shifts: UserShift[]) {
  return shifts.map((shift) => ({
    id: shift.id,
    title: shift.teams?.name ?? "Shift",
    start: shift.start_time,
    end: shift.end_time,
    extendedProps: {
      type: "shift",
      avatarUrl: shift.profiles?.avatar_url,
    },
  }));
}
