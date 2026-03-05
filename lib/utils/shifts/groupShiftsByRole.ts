import { TeamRoles, Shifts } from "@/lib/types/dbexports";

export function groupShiftsByRole(
  shifts: Shifts[],
  roles: TeamRoles[],
): Map<string, Shifts[]> {
  const map = new Map<string, Shifts[]>();

  shifts.forEach((shift) => {
    const role = roles.find((r) => r.id === shift.role_id);
    if (!role) return;

    let shifts = map.get(role.name);

    if (!shifts) {
      shifts = [];
      map.set(role.name, shifts);
    }

    shifts.push(shift);
  });

  return map;
}
