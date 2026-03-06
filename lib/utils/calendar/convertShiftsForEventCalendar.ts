import { ShiftWithProfile, TeamRoles } from "@/lib/types/dbexports";

export function convertShiftsForEventCalendar(
  shifts: ShiftWithProfile[],
  roles: TeamRoles[],
) {
  return shifts
    .filter((shift) => shift.assigned_user_id !== null)
    .map((shift) => {
      const role = roles.find((r) => r.id === shift.role_id);
      return {
        id: shift.id,
        title: shift.profiles?.display_name ?? "",
        start: shift.start_time,
        end: shift.end_time,
        extendedProps: {
          type: "shift",
          avatarUrl: shift.profiles?.avatar_url,
          roleColor: role?.color ?? null,
        },
      };
    });
}
