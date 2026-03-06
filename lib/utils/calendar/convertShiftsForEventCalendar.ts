import { Shifts } from "@/lib/types/dbexports";

export function convertShiftsForEventCalendar(shifts: Shifts[]) {
  return shifts
    .filter((shift) => shift.assigned_user_id)
    .map((shift) => ({
      title: shift.profiles?.display_name ?? (shift.assigned_user_id as string),
      start: shift.start_time as string,
      end: shift.end_time as string,
      extendedProps: {
        type: "shift",
        avatarUrl: shift.profiles?.avatar_url,
      },
    }));
}
